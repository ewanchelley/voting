import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-kemeny',
  templateUrl: './kemeny.component.html',
  styleUrls: ['./kemeny.component.css']
})
export class KemenyComponent implements OnInit {

  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

  kemenyConsensus: string[] = [];
  kemenyScore: number = 0;

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  reCalculate() {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.kemeny();
  }

  kemeny(){
    let Q: number[][] = this.constructQ();
    let solver = require("javascript-lp-solver");
    let results;
    let model: string[] = [];

    let length = this.candidates.length;

    // Set the objective function
    let objective = "min:";
    for (let a = 0; a < length; a++) {
      for (let b = 0; b < length; b++) {
        if (a != b) {
          objective += ` +${Q[a][b]} x${b}_${a}`;
        }
      }
    }
    model.push(objective);

    // Add constraint 0 <= x{a,b} <=1
    for (let a = 0; a < length; a++) {
      for (let b = 0; b < length; b++) {
        if (a != b){
          model.push(`0 <= x${a}_${b} <= 1`);
        }
      }
    }

    // Add constraint x{a,b} + x{b,a} = 1
    for (let a = 0; a < length; a++) {
      for (let b = a + 1; b < length; b++) {
        model.push(`x${a}_${b} + x${b}_${a} = 1`);
      }
    }

    // Add constraint x{a,b} + x{b,c} + x{c,a} >= 1
    for (let a = 0; a < length; a++) {
      for (let b = 0; b < length; b++) {
        for (let c = 0; c < length; c++) {
          if (a != b && a != c && b!= c){
            model.push(`x${a}_${b} + x${b}_${c} + x${c}_${a} >= 1`);
          }
        }
      }
    }

    // Enforce integer values
    for (let a = 0; a < length; a++) {
      for (let b = 0; b < length; b++) {
        if (a != b) {
          model.push(`int x${a}_${b}`);
        }
      }
    }

    console.log(model);
    model = solver.ReformatLP(model);
    results = solver.Solve(model);
    console.log(results);

    // Construct rankings by counting number of times each candidate
    // is preferred over some another and then sorting totals
    let timesPref = new Array(length).fill(0);
    for (let result of Object.keys(results)){
      if (result[0] === "x"){
        let ids = result.slice(1).split("_");
        timesPref[+ids[0]] += 1;
      }
    }
    this.kemenyConsensus = this.candidates.slice();
    this.kemenyConsensus = this.kemenyConsensus.sort((a,b) => timesPref[this.candidates.indexOf(b)] - timesPref[this.candidates.indexOf(a)])
    this.kemenyScore = results.result;
  }

  constructQ(): number[][] {
    let i, j = 0;
    const length = this.candidates.length;
    let numRankings: number[][] = []
    let Q: number[][] = []

    // initialise preferred with zeros
    for (let a = 0; a < length; a++) {
      Q.push(new Array(length).fill(0));
    }

    // convert rankings to numeric rankings
    for (let ranking of this.rankings) {
      let numRanking = ranking.map(candidate => this.candidates.indexOf(candidate))
      numRankings.push(numRanking);
    }

    // loop through permutations of candidates for each ranking O(C^2R)
    for (let ranking of numRankings) {
      for (i = 0; i < length; i++) {
        for (j = i + 1; j < length; j++) {
          let c1 = ranking[i];
          let c2 = ranking[j];
          Q[c1][c2]++;
        }
      }
    }

    return Q;
  }

  round(i: number) {
    return Math.round(i);
  }
}
