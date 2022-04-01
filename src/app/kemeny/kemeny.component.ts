import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Console } from 'console';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-kemeny',
  templateUrl: './kemeny.component.html',
  styleUrls: ['./kemeny.component.css']
})
export class KemenyComponent implements OnInit {

  svc: RankingsService;
  router: Router;

  candidates: string[] = [];
  rankings: string[][] = [];

  kemenyConsensus: string[] = [];
  kemenyScore: number = 0;

  constructor(svc: RankingsService, router: Router) {
    this.svc = svc;
    this.router = router
  }

  ngOnInit(): void {
    this.reCalculate();
    //this.testAgainstBruteForce(15, 10000, 100, true);
    //this.testAgainstBruteForce(11, 5, 1, true);
    //this.testAgainstBruteForce(7, 100, 20, true);
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
    [this.kemenyConsensus, this.kemenyScore] = this.kemeny(this.candidates, this.rankings);
  }

  kemeny(candidates: string[], rankings: string[][]): [string[], number]{
    let Q: number[][] = this.constructQ(candidates, rankings);
    let solver = require("javascript-lp-solver");
    let results;
    let model: string[] = [];

    let length = candidates.length;

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

    model = solver.ReformatLP(model);
    results = solver.Solve(model);

    let consensus = this.svc.getRankingFromIP(results, candidates);
    let score = results.result;
    return [consensus, score];
  }

  constructQ(candidates: string[], rankings: string[][]): number[][] {
    let i, j = 0;
    const length = candidates.length;
    let numRankings: number[][] = []
    let Q: number[][] = []

    // initialise preferred with zeros
    for (let a = 0; a < length; a++) {
      Q.push(new Array(length).fill(0));
    }

    // convert rankings to numeric rankings
    for (let ranking of rankings) {
      let numRanking = ranking.map(candidate => candidates.indexOf(candidate))
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

  kemenyBruteForce(candidates: string[], rankings: string[][]): [string[], number] {
    let permutations = this.svc.getPermutations(candidates);
    let min = Infinity;
    let best: string[] = [];
    for (let p of permutations){
      let distance = 0;
      for (let ranking of rankings){
        distance += this.svc.kendall(p, ranking);
      }
      if (distance < min){
        min = distance;
        best = p;
      }
    }
    return [best, min];
  }

  // randomly generates candidates and rankings then compares brute force solution to integer programming 
  testAgainstBruteForce(numCandidates: number, numRankings: number, iterations: number, verbose: boolean = false){
    let candidates = [];
    if (verbose) {
      console.log(`Generating ${numCandidates} candidates.`)
    }
    for (let c = 0; c < numCandidates; c++) {
      candidates.push(`C_${c}`);
    }

    // store number of times that a different consensus is reached
    let diffConsensus = 0;
    let IPTimes = [];
    let BFTimes = [];

    for (let i = 0; i < iterations; i++){
      if (verbose){
        console.log(`Iteration: ${i + 1}/${iterations}`)
      }
      // randomly generate rankings
      let rankings = [];
      for (let r = 0; r < numRankings; r++){
        rankings.push(this.svc.shuffle(candidates.slice()));
      }

      // apply IP and BF then compare results
      let IPResult, IPScore, BFResult, BFScore;

      let t = performance.now();
      
      [IPResult, IPScore] = this.kemeny(candidates, rankings);
      IPTimes.push(performance.now() - t);
      /*
      t = performance.now();
      [BFResult, BFScore] = this.kemenyBruteForce(candidates, rankings);
      BFTimes.push(performance.now() - t);
      /*
      if (!this.svc.arrayEquals(IPResult, BFResult)){
        diffConsensus += 1;
      }
      if (IPScore !== BFScore){
        this.svc.printBFmismatch("kemeny consensus", rankings, IPScore, IPResult, BFScore, BFResult);
        break;
      }*/
    }
    console.log(`Agreement in all ${iterations} iterations.`)
    console.log(`The same ranking was returned ${iterations - diffConsensus}/${iterations} times.`)
    this.svc.printSummaryOfTimes(IPTimes, 3, "IP model");
    //this.svc.printSummaryOfTimes(BFTimes, 3, "Brute Force");
  }

  
  viewKendall(i: number){
    let kendallRankings: string[][] = [this.kemenyConsensus, this.rankings[i]];
    this.svc.setKendallRankings(kendallRankings);
    this.router.navigate(['/kendall'])

  }

  round(i: number) {
    return Math.round(i);
  }
}
