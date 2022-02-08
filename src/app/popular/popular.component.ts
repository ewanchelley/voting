import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
})
export class PopularComponent implements OnInit {

  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

  proposedString: string = "";
  proposed: string[] = [];
  formattedProposedString: string = "";

  bestAltWeakly: string[] = [];
  bestAltTextWeakly: string = "";
  bestScoreWeakly: number = 0;

  bestAltStrongly: string[] = [];
  bestAltTextStrongly: string = "";

  // these cannot be below 0 since IP model can find the same ranking as R0
  bestScoreStrongly: number = 0;
  bestPPStrongly: number = 0;
  bestPNStrongly: number = 0;

  useBruteForce = true;

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.proposed = [];
    this.proposedString = "";
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.svc.changesMade.subscribe(() => {
      this.rankings = this.svc.getRankings();
      this.candidates = this.svc.getCandidates();
    });
    //this.testAgainstBruteForce(5, 6, 5, true);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  reCalculate() {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    if (this.useBruteForce) {
      [this.bestAltWeakly, this.bestScoreWeakly, this.bestAltStrongly, this.bestScoreStrongly, this.bestPPStrongly, this.bestPNStrongly] 
      = this.popularBruteForce(this.candidates, this.rankings, this.proposed);
    } else {
      [this.bestAltWeakly, this.bestScoreWeakly] = this.weakly(this.candidates, this.rankings, this.proposed);
      [this.bestAltStrongly, this.bestScoreStrongly, this.bestPPStrongly, this.bestPNStrongly] 
      = this.strongly(this.candidates, this.rankings, this.proposed, true);
    }
    this.bestAltTextWeakly = this.svc.convertToString(this.bestAltWeakly);
    this.bestAltTextStrongly = this.svc.convertToString(this.bestAltStrongly);
  }

  checkProposed() {
    let proposedRanking = this.svc.convertToArray(this.proposedString);
    if (this.svc.isValidRanking(proposedRanking)) {
      this.proposed = proposedRanking;
      this.formattedProposedString = this.svc.convertToString(this.proposed);
      this.reCalculate();
    }
    this.proposedString = this.svc.convertToString(this.proposed);
  }

  quickAdd(candidate: string) {
    let clean = this.proposedString.trim();
    if (clean === "" || clean.substr(clean.length - 1) === ",") {
      this.proposedString += candidate;
    } else {
      this.proposedString += ", " + candidate;
    }
  }

  showResults() {
    return this.bestAltWeakly.length != 0;
  }

  isWeaklyPopular() {
    return this.checkWeakPopularity(this.bestScoreWeakly, this.rankings.length);
  }

  checkWeakPopularity(PP: number, length: number) {
    return PP <= (length / 2);
  }
  
  isStronglyPopular() {
    return this.checkStrongPopularity(this.bestScoreStrongly);
  }

  checkStrongPopularity(strongScore: number) {
    return strongScore <= 0;
  }

  numAbstainingVoters() {
    return this.rankings.length - this.bestPPStrongly - this.bestPNStrongly;
  }

  weakly(candidates: string[], rankings: string[][], R0: string[], verbose=false): [string[], number]{
    let results = this.popular(false, candidates, rankings, R0)
    if (verbose) { console.log(results) };
    let bestAlt = this.svc.getRankingFromIP(results, this.candidates);
    let score = results.result;
    return [bestAlt, score];
  }

  strongly(candidates: string[], rankings: string[][], R0: string[], verbose=false): [string[], number, number, number] {
    let results = this.popular(true, candidates, rankings, R0)
    if (verbose) { console.log(results) };
    let bestAlt = this.svc.getRankingFromIP(results, this.candidates);
    let score = results.result;
    let PP = results.PP;
    let PN = results.PN;
    if (!PP){
      PP = 0;
    }
    if (!PN) {
      PN = 0;
    }
    

    return [bestAlt, score, PP, PN];
  }

  // Run IP model to find if a ranking is weakly or strongly popular
  // If strongly = true, will check for strong popularity otherwise for weak popularity
  popular(strongly: boolean, candidates: string[], rankings: string[][], R0: string[], verbose=false) {

    let solver = require("javascript-lp-solver");
    let model: string[] = [];

    let m = candidates.length;
    let n = rankings.length;


    // OBJECTIVE FUNCTION

    if (strongly){
      // Set the objective function for strongly popular
      // max: SUM(p{i}+) - SUM(p{i}-)
      // PP = SUM(p{i}+), PN = SUM(p{i}-)
      let objective = "max: PP - PN";
      model.push(objective);
    } else {
      // Set the objective function for weakly popular
      // max: SUM(p{i}+)
      let objective = "max:";
      for (let i = 1; i <= n; i++) {
        objective += ` +p${i}P`;
      }
      model.push(objective);
    }
    

    // SET Ki and Ri

    // Set Ki
    let K = this.getKendalls(R0, rankings);
    for(let i = 1; i <= n; i++){
      model.push(`K${i} = ${K[i-1]}`);
    }

    // Set Ri{r,s} for all i
    for(let i = 1; i <= n; i++){
      for (let r = 0; r < m; r++) {
        for (let s = r + 1; s < m; s++) {
          let r_candidate = candidates[r];
          let s_candidate = candidates[s];
          let r_before_s = rankings[i-1].indexOf(r_candidate) < rankings[i-1].indexOf(s_candidate);
          if(r_before_s){
            model.push(`R${i}_${r}_${s} = 1`);
          } else {
            model.push(`R${i}_${r}_${s} = 0`);
          }
        }
      }
    }


    // VALID RANKING CONSTRAINTS

    // Add constraint 0 <= x{r,s} <=1
    for (let r = 0; r < m; r++) {
      for (let s = 0; s < m; s++) {
        if (r != s) {
          model.push(`0 <= x${r}_${s} <= 1`);
        }
      }
    }

    // Add constraint x{r,s} + x{s,r} = 1
    for (let r = 0; r < m; r++) {
      for (let s = r + 1; s < m; s++) {
        model.push(`x${r}_${s} + x${s}_${r} = 1`);
      }
    }

    // Add constraint x{r,s} + x{s,t} + x{t,r} >= 1
    for (let r = 0; r < m; r++) {
      for (let s = 0; s < m; s++) {
        for (let t = 0; t < m; t++) {
          if (r != s && s != t && r != t) {
              model.push(`x${r}_${t} - x${r}_${s} - x${s}_${t} >= -1`);
          }
        }
      }
    }
    

    // CONSTRAINTS FOR k{i,r,s} and KiPRIME

    // Add constraint for k{i,r,s}
    for (let i = 1; i <= n; i++) {
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          // Ensure k{i,r,s} = 1 if the r,s orders are different and 0 otherwise
          model.push(`0 <= k${i}_${r}_${s} <= 1`);
          model.push(`x${r}_${s} - R${i}_${r}_${s} - k${i}_${r}_${s} <= 0`);
          model.push(`R${i}_${r}_${s} - x${r}_${s} - k${i}_${r}_${s} <= 0`);
          model.push(`x${r}_${s} + R${i}_${r}_${s} - k${i}_${r}_${s} >= 0`);
          model.push(`x${r}_${s} + R${i}_${r}_${s} + k${i}_${r}_${s} <= 2`);
        }
      }
    }

    
    // KiPRIME = SUM{k{i,r,s}} for each i
    for (let i = 1; i <= n; i++) {
      let constraint = `K${i}PRIME`
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          constraint += ` -k${i}_${r}_${s}`;
        }
      }
      constraint += ` = 0`
      model.push(constraint);
    }


    // COUNT TIMES R preferred to R_0

    // Constraints for p{i}+
    let maxKendall = (m * (m-1))/2
    for (let i = 1; i <= n; i++) {
      // p{i}+ is 1 if R preferred, 0 otherwise
      model.push(`0<= p${i}P <= 1`)
      model.push(`p${i}P - ${1 / maxKendall} K${i} + ${1 / maxKendall} K${i}PRIME >=  0`);
      model.push(`K${i} - K${i}PRIME - ${maxKendall + 1} p${i}P >= -${maxKendall}`);
    }

    // Additional Constraints for strongly popular
    if (strongly){
      // Constraints for p{i}-
      for (let i = 1; i <= n; i++) {
        // p{i}+ is 1 if R preferred, 0 otherwise
        model.push(`0<= p${i}N <= 1`)
        model.push(`p${i}N - ${1 / maxKendall} K${i}PRIME + ${1 / maxKendall} K${i} >=  0`);
        model.push(`K${i}PRIME - K${i} - ${maxKendall + 1} p${i}N >= -${maxKendall}`);
      }

      // Set PP = SUM(p{i}+)
      let constraint = `PP`
      for (let i = 1; i <= n; i++) {
        constraint += ` -p${i}P`;
      }
      constraint += ` = 0`
      model.push(constraint);

      // Set PN = SUM(p{ i } -)
      constraint = `PN`
      for (let i = 1; i <= n; i++) {
        constraint += ` -p${i}N`;
      }
      constraint += ` = 0`
      model.push(constraint);

    }


    // ENFORCE INTEGERS FOR ALL VARIABLES

    // Enforce int for p{i}+
    for(let i = 1; i <= n; i++){
      model.push(`int p${i}P`)
    }

    // Additional variables for strongly popular
    if (strongly){
      // Enforce int for p{i}-
      for (let i = 1; i <= n; i++) {
        model.push(`int p${i}N`)
      }
      // Enforce int for PP and PN
      model.push(`int PP`)
      model.push(`int PN`)
    }

    // Enforce int for x{r,s}
    for (let r = 0; r < m; r++) {
      for (let s = 0; s < m; s++) {
        if (r != s) {
          model.push(`int x${r}_${s}`);
        }
      }
    }

    // Enforce int for k{i,r,s}
    for (let i = 1; i <= n; i++) {
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          model.push(`int k${i}_${r}_${s}`);
        }
      }
    }

    // Enforce int for Ri{r,s}
    for (let i = 1; i <= n; i++) {
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          model.push(`int R${i}_${r}_${s}`);
        }
      }
    }

    // Enforce int for Ki
    for (let i = 1; i <= n; i++) {
      model.push(`int K${i}`);
    }

    // Enforce int for KiPRIME
    for (let i = 1; i <= n; i++) {
      model.push(`int K${i}PRIME`);
    }

    if (verbose) {console.log(model)};
    model = solver.ReformatLP(model);
    if (verbose) {console.log(model)};
    return solver.Solve(model);  
  }

  // Brute force to find if a ranking is weakly or strongly popular
  popularBruteForce(candidates: string[], rankings: string[][], R0: string[]): [string[], number, string[], number, number, number]{
    let K = this.getKendalls(R0, rankings);
    let alternatives = this.svc.getPermutations(candidates);

    // Keep track of best alternative found
    let bestWeakScore = -Infinity;
    let bestWeakRanking: string[] = [];
    let bestStrongScore = -Infinity;
    let bestStrongRanking: string[] = [];

    let bestPPstrong = 0;
    let bestPNstrong = 0;

    for (let p of alternatives) {
      let PP = 0;
      let PN = 0;
      for (let i = 0; i < rankings.length; i++) {
        let distance = this.svc.kendall(p, rankings[i]);
        if (distance < K[i]){
          PP += 1;
        } else if (distance > K[i]){
          PN += 1;
        }
      }
      // Check if best alternative for weak popularity
      if (PP > bestWeakScore) {
        bestWeakScore = PP;
        bestWeakRanking = p;
      }
      // Check if best alternative for strong popularity
      if ((PP - PN) > bestStrongScore){
        bestStrongScore = PP - PN;
        bestStrongRanking = p;
        bestPPstrong = PP;
        bestPNstrong = PN;
      }
    }
    return [bestWeakRanking, bestWeakScore, bestStrongRanking, bestStrongScore, bestPPstrong, bestPNstrong];
  }

  getKendalls(R0: string[], rankings: string[][]): number[] {
    let Ki = [];
    for(let Ri of rankings){
      Ki.push(this.svc.kendall(R0, Ri));
    }
    return Ki;
  }

  // randomly generates candidates and rankings then compares brute force solution to integer programming 
  testAgainstBruteForce(numCandidates: number, numRankings: number, iterations: number, verbose: boolean = false) {
    let candidates = [];
    console.log(`Generating ${numCandidates} candidates.`)
    for (let c = 0; c < numCandidates; c++) {
      candidates.push(`C_${c}`);
    }

    // store number of times that a different result is reached
    let numNotPopular = 0;
    let numStronglyPopular = 0;
    let numWeaklyOnly = 0;

    let IPWeaklyTimes = [];
    let IPStronglyTimes = [];
    let BFTimes = [];

    for (let i = 0; i < iterations; i++) {
      console.log(`Iteration: ${i + 1}/${iterations}`)
      // randomly generate rankings
      let rankings = [];
      for (let r = 0; r < numRankings; r++) {
        rankings.push(this.svc.shuffle(candidates.slice()));
      }

      // apply IP and BF then compare results
      let IPWeakResult, IPWeakScore, IPStrongResult, IPStrongScore;
      let BFWeakResult, BFWeakScore, BFStrongResult, BFStrongScore;
      let stronglyPP, stronglyPN;
      // Generate random R0
      let R0 = this.svc.shuffle(candidates.slice());

      if (verbose) { console.log("Runnning IP for weakly popular...") }
      let t = performance.now();
      [IPWeakResult, IPWeakScore] = this.weakly(candidates, rankings, R0);
      IPWeaklyTimes.push(performance.now() - t);
      t = performance.now();
      if (verbose) { console.log("Runnning IP for strongly popular...") }
      [IPStrongResult, IPStrongScore, stronglyPP, stronglyPN] = this.strongly(candidates, rankings, R0);
      IPStronglyTimes.push(performance.now() - t);
      t = performance.now();
      if (verbose) { console.log("Runnning brute force...") }
      [BFWeakResult, BFWeakScore, BFStrongResult, BFStrongScore] = this.popularBruteForce(candidates, rankings, R0);
      BFTimes.push(performance.now() - t);

      // Flag error if IP and BF disagree about weak popularity
      if (IPWeakScore !== BFWeakScore) {
        this.svc.printBFmismatch("weak popularity", rankings, IPWeakScore, IPWeakResult, BFWeakScore, BFWeakResult);
        break;
      }
      // Flag error if IP and BF disagree about strong popularity
      if (IPWeakScore !== BFWeakScore) {
        this.svc.printBFmismatch("strong popularity", rankings, IPStrongScore, IPStrongResult, BFStrongScore, BFStrongResult);
        break;
      }

      // Log number of cases of not weakly popular, weakly and strongly popular, only weakly popular
      let isWeaklyPopular = this.checkWeakPopularity(IPWeakScore, numRankings);
      let isStronglyPopular = this.checkStrongPopularity(IPStrongScore);
      
      if (!isWeaklyPopular && !isStronglyPopular){
        numNotPopular += 1;
      } else if (isWeaklyPopular && isStronglyPopular){
        numStronglyPopular += 1;
      } else if (isWeaklyPopular && !isStronglyPopular){
        numWeaklyOnly += 1;
        // Log these as they are rare
        console.log("Found weakly but not strongly popular")
        console.log("Rankings")
        console.log(rankings);
        console.log("R0")
        console.log(R0);
      } else {
        // Print error, should be impossible to be strongly popular but not weakly
        console.log("ERROR: cannot be strongly popular but not weakly");
        console.log("Rankings")
        console.log(rankings);
        console.log("R0")
        console.log(R0);
        break;
      }

    }
    console.log(`Agreement in all ${iterations} iterations.`);
    console.log(`Number of times not popular: ${numNotPopular}`);
    console.log(`Number of times weakly and strongly popular: ${numStronglyPopular}`);
    console.log(`Number of times weakly popular but not strongly: ${numWeaklyOnly}`);
    this.svc.printSummaryOfTimes(IPWeaklyTimes, 3, "IP Weakly");
    this.svc.printSummaryOfTimes(IPStronglyTimes, 3, "IP Strongly");
    this.svc.printSummaryOfTimes(BFTimes, 3, "Brute Force");
  }

  round(i: number) {
    return Math.round(i);
  }

  tryRandom() {
    let candidatesToShuffle = this.candidates.slice();
    let randomRanking = this.svc.shuffle(candidatesToShuffle);
    this.proposedString = this.svc.convertToString(randomRanking);
    this.checkProposed();
  }

}
