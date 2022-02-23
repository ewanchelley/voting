import { Injectable } from '@angular/core';
import { Console } from 'console';
import { ToastrService } from 'ngx-toastr';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RankingsService {

  toastr: ToastrService;

  constructor(toastr: ToastrService) {
    this.toastr = toastr;
  }

  private candidates = ["A", "B", "C", "D"];
  private rankings = [
  ["A", "B", "C", "D"],
  ["B", "A", "C", "D"],
  ["A", "B", "C", "D"],
  ["D", "B", "C", "A"],
  ["A", "B", "C", "D"]];

  private kendallRankings = [
    ["A", "B", "C", "D"],
    ["B", "A", "C", "D"]];


  private premadeRankingSets: { [name: string] : string[][]} = {
    "weaklyNotStrongly": [
      ["C", "A", "B", "E", "F", "D"],
      ["A", "B", "C", "F", "D", "E"],
      ["B", "C", "A", "D", "E", "F"],
      ["A", "B", "C", "D", "E", "F"],
      ["B", "A", "C", "F", "D", "E"],
      ["B", "C", "A", "D", "F", "E"],
    ],
    "noCondorcet": [
      ["B", "A", "C"],
      ["C", "B", "A"],
      ["B", "A", "C"],
      ["A", "C", "B"],
      ["C", "A", "B"],
    ]
  }

  changesMade = new Subject<void>();

  onChangesMade() {
    if (this.rankings.length >= 2){
      this.kendallRankings = this.rankings.slice(0, 2);
    }
    else if (this.rankings.length >= 1){
      let firstRanking = this.rankings.slice()[0]
      this.kendallRankings = [firstRanking, firstRanking.slice()];
    } else {
      this.kendallRankings = 
      [["A", "B"],
       ["B", "A"]];
    }
    this.changesMade.next();
  }

  // Candidate methods

  getCandidates(): string[] {
    return this.candidates;
  }

  pushCandidate(candidate: string) {
    this.candidates.push(candidate);
  }

  addCandidateToAllRankings(candidate: string) {
    this.rankings.forEach(r => (r.push(candidate)));
    this.onChangesMade()
  }

  deleteCandidate(index: number) {
    let candidate = this.candidates[index];
    this.candidates.splice(index, 1);
    this.rankings.forEach(r => (r.splice(r.indexOf(candidate), 1)));
    this.onChangesMade()
  }

  getCandidate(index: number){
    return this.candidates[index];
  }

  isValidCandidate(candidate: string, toastIfInvalid: boolean = false) {
    // Prevent empty candidate name
    if (candidate === ""){
      if (toastIfInvalid){
        this.displayToast("Name of candidate cannot be blank.", "Blank Name");
      }
      return false;
    }
    // Prevent repeated candidate
    if (this.candidates.includes(candidate)) {
      if (toastIfInvalid) {
        this.displayToast("Cannot add candidate as it already exists", "Already Exists");
      }
      return false;
    }
    // Prevent commas in name
    if (candidate.includes(",")) {
      if (toastIfInvalid) {
        this.displayToast("Cannot add candidate with comma in name", "Includes Comma");
      }
      return false;
    }
    return true;
  }

  updateCandidateName(index: number, newName: string){
    let oldName = this.candidates[index];
    this.rankings.forEach(r => (r[r.indexOf(oldName)] = newName));
    this.candidates[index] = newName;
    this.onChangesMade()
  }


  // Ranking methods

  getRankings(): string[][] {
    return this.rankings;
  }

  getKendallRankings(): string[][] {
    return this.kendallRankings;
  }

  setKendallRankings(rankings: string[][]) {
    this.kendallRankings = rankings;
  }

  pushRanking(ranking: string[]){
    this.rankings.push(ranking);
    console.log(this.rankings);
    this.onChangesMade()
  }

  editRanking(index: number, ranking: string[]){
    this.rankings[index] = ranking;
    this.onChangesMade()
  }

  deleteRanking(index: number) {
    this.rankings.splice(index, 1);
    this.onChangesMade()
  }

  getRanking(index: number): string[]{
    return this.rankings[index];
  }

  isValidRanking(ranking: string[], toastIfInvalid: boolean = false): boolean {
    const sortedCandidates = this.sortStringArray(this.candidates.slice());
    const sortedRanking = this.sortStringArray(ranking.slice());
    let matchesCandidates = this.arrayEquals(sortedCandidates, sortedRanking);
    if (!matchesCandidates && toastIfInvalid){
      this.displayToast("Ranking must contain each of the candidates names separated by commas","Invalid Ranking");
    }
    return matchesCandidates;
  }

  clearRankings() {
    this.rankings = [];
    this.onChangesMade();
  }

  // Algorithms

  kendall(r1: string[], r2: string[]): number {
    length = r1.length;
    let i, j, v = 0;
    let a: boolean, b: boolean;

    for (i = 0; i < length; i++) {
      for (j = i + 1; j < length; j++) {
        let n1 = r1[i];
        let n2 = r1[j];
        a = r1.indexOf(n1) < r1.indexOf(n2) && r2.indexOf(n1) > r2.indexOf(n2);
        b = r1.indexOf(n1) > r1.indexOf(n2) && r2.indexOf(n1) < r2.indexOf(n2);

        if (a || b) {
          v++;
        }
      }
    }
    return v;
  }

  kendallDisagreements(r1: string[], r2: string[]): string[][] {
    length = r1.length;
    let i, j = 0;
    let a: boolean, b: boolean;
    let disagreements: string[][] = []

    for (i = 0; i < length; i++) {
      for (j = i + 1; j < length; j++) {
        let n1 = r1[i];
        let n2 = r1[j];
        a = r1.indexOf(n1) < r1.indexOf(n2) && r2.indexOf(n1) > r2.indexOf(n2);
        b = r1.indexOf(n1) > r1.indexOf(n2) && r2.indexOf(n1) < r2.indexOf(n2);

        if (a || b) {
          disagreements.push(this.sortStringArray([n1, n2]));
        }
      }
    }
    return disagreements;
  }


  // For file upload/download

  validRankingSet(rankings: string[][]): boolean {
    if (rankings.length < 1) {
      return false;
    }
    let candidates = this.sortStringArray(rankings[0]);
    for (let ranking of rankings){
      if (!this.arrayEquals(this.sortStringArray(ranking), candidates)){
        console.log(candidates);
        console.log(ranking)
        console.log("failed here")
        return false;
      }
    }
    return true;
  }

  constructFile(): Blob {
    let rankingStrings: string[]= [];
    this.rankings.forEach(r => (rankingStrings.push(this.convertToString(r))));
    let multilineString = rankingStrings.join("\n");
    return new Blob([multilineString], { type: '.txt' });
  }

  constructRankings(rankings: string[][]) {
    this.candidates = this.sortStringArray(rankings[0]);
    this.rankings = this.deepCopy(rankings);
    this.onChangesMade()
  }

  constructRankingsPremade(name: string) {
    console.log("a")
    let rankings = this.premadeRankingSets[name];
    console.log(rankings);
    if (rankings){
      this.constructRankings(rankings);
    }
  }

  // Helper methods

  sortStringArray(a: string[]): string[] {
    return a.slice().sort((n1, n2) => {
      if (n1 > n2) {
        return 1;
      }

      if (n1 < n2) {
        return -1;
      }

      return 0;
    });
  }

  arrayEquals(a: string[], b: string[]) {
    return (a.length === b.length) && (a.every((val, index) => val === b[index]));
  }

  deepCopy(arr: string[][]) {
    return JSON.parse(JSON.stringify(arr))
  }

  suffixIncluded(i: number) {
    let j = i % 10;
    let k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  convertToArray(s: string): string[] {
    let arr = s.split(",");
    arr = arr.map(x => x.trim())
    return arr;
  }

  convertToString(r: string[]): string {
    return r.join(", ");
  }

  getPermutations(ranking: string[]) {
    let permArr: string[][] = [];
    let usedChars: string[] = [];

    function permute(input: string[]) {
      var i, ch;
      for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
          permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
      }
      return permArr
    };
    permute(ranking);
    return permArr;
  }

  shuffle(ranking: string[]) {
    let currentIndex = ranking.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [ranking[currentIndex], ranking[randomIndex]] = [ranking[randomIndex], ranking[currentIndex]];
    }
    return ranking;
  }

  printSummaryOfTimes(times: number[], dp: number, name: string=""){
    let average = times.reduce((a, b) => (a + b)) / times.length;
    let min = Math.min.apply(Math, times);
    let max = Math.max.apply(Math, times);

    let roundedAverage = Math.round(average * (10 ** dp)) / 10 ** dp;
    let roundedMin = Math.round(min * (10 ** dp)) / 10 ** dp;
    let roundedMax = Math.round(max * (10 ** dp)) / 10 ** dp;

    console.log(`Time taken ${name} - Average: ${roundedAverage}ms, Min: ${roundedMin}ms, Max: ${roundedMax}ms`);
  }

  // Deal with IP model output

  getRankingFromIP(results: any, candidates: string[]): string[] {
    // Construct rankings by counting number of times each candidate
    // is preferred over some another and then sorting totals
    let timesPref = new Array(candidates.length).fill(0);
    for (let result of Object.keys(results)) {
      if (result[0] === "x") {
        let ids = result.slice(1).split("_");
        timesPref[+ids[0]] += 1;
      }
    }
    let result = candidates.slice();
    result = result.sort((a, b) => timesPref[candidates.indexOf(b)] - timesPref[candidates.indexOf(a)])
    return result;
  }

  // Log to console if results from IP and BF do not match
  printBFmismatch(alg: string, rankings: string[][], IPScore: number, IPResult: string[], BFScore: number, BFResult: string[]){
    console.log(`MISMATCH found between IP and BF results for ${alg}`);
    console.log("Rankings:");
    console.log(rankings);
    console.log("IPScore: ");
    console.log(IPScore);
    console.log("IPResult");
    console.log(IPResult);
    console.log("BFScore: ");
    console.log(BFScore);
    console.log("BFResult");
    console.log(BFResult);
  }

  // Warn that algorithm may run slowly if certain candidates/rankings thresholds are met
  isDangerous(alg: string): boolean{
    // The max allowable thresholds for each algorithm
    const thresholds: {[alg: string]: {candidates: number, rankings: number}} = {
       "popular": { candidates: 7, rankings: 200 }, 
       "kemeny": { candidates: 25, rankings: 10000 }}
    let threshold = thresholds[alg];
    if (!threshold){
      return false;
    }
    if (this.candidates.length > threshold.candidates || this.rankings.length > threshold.rankings){
      return true;
    } else {
      return false;
    }
  }

  // Display toast error message
  displayToast(msg: string, title: string){
    this.toastr.error(msg, title);
  }
}
