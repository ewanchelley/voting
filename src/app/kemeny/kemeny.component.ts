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

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  reCalculate() {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.kemeny();
  }

  solvePlanes(){
    var solver = require("javascript-lp-solver"),
      results,
      model = {
        "optimize": "capacity",
        "opType": "max",
        "constraints": {
          "plane": { "max": 44 },
          "person": { "max": 512 },
          "cost": { "max": 300000 },
          "random_thing": { "max": 15, "min": 15 },
        },
        "variables": {
          "brit": {
            "capacity": 20000,
            "plane": 1,
            "person": 8,
            "cost": 5000
          },
          "yank": {
            "capacity": 30000,
            "plane": 1,
            "person": 16,
            "cost": 9000,
            "random_thing": 1,
          }
        },
      };

    results = solver.Solve(model);
    console.log(results);

    let distances = [[1, 2], [3, 4]]
    let i = 0;
    let j = 1;
    console.log(` ${distances[i][j]} x${i}x${j}`);
  }

  kemeny(){
    let Q: number[][] = this.constructQ();
    let solver = require("javascript-lp-solver");
    let results;
    let model: any = {
      "optimize": "distance",
      "opType": "min"
    };

    let length = this.candidates.length;
    if(length < 3){
      //need to deal with these cases
      return;
    }

    let constraints: { [key: string]: {[maxmin: string]: number}} = {};
    let variables: { [key: string]: { [attribute: string]: number }} = {}
    for (let i = 0; i < length; i++){
      for (let j=i+1; j < length; j++){
        let ij = `${i}&${j}`;
        constraints[ij] = {"max": 1, "min": 1};
        let var1: {[attribute: string]: number} = {"distance": Q[i][j]}
        var1[ij] = 1;
        variables[`Q${i},${j}`] = var1;
        let var2: { [attribute: string]: number } = { "distance": Q[j][i] }
        var2[ij] = 1;
        variables[`Q${j},${i}`] = var2;
      }
    }
    model.constraints = constraints;
    model.variables = variables;

    console.log(model);

    results = solver.Solve(model);
    console.log(results);
    
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

}
