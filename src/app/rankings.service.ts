import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RankingsService {

  constructor() { }

  private candidates = ["A", "B", "C", "D"];
  private rankings = [
  ["A", "B", "C", "D"],
  ["B", "A", "C", "D"],
  ["A", "B", "C", "D"],
  ["D", "B", "C", "A"],
  ["A", "B", "C", "D"]];

  changesMade = new Subject<void>();


  // Candidate methods
  getCandidates(): string[] {
    return this.candidates;
  }

  pushCandidate(candidate: string) {
    this.candidates.push(candidate);
  }

  addCandidateToAllRankings(candidate: string) {
    this.rankings.forEach(r => (r.push(candidate)));
    this.changesMade.next();
  }

  deleteCandidate(index: number) {
    let candidate = this.candidates[index];
    this.candidates.splice(index, 1);
    this.rankings.forEach(r => (r.splice(r.indexOf(candidate), 1)));
    this.changesMade.next();
  }

  getCandidate(index: number){
    return this.candidates[index];
  }

  isValidCandidate(candidate: string) {
    let empty = candidate === "";
    let alreadyExists = this.candidates.includes(candidate);
    let containsComma = candidate.includes(",")
    return !(empty || alreadyExists || containsComma)
  }

  updateCandidateName(index: number, newName: string){
    let oldName = this.candidates[index];
    this.rankings.forEach(r => (r[r.indexOf(oldName)] = newName));
    this.candidates[index] = newName;
    this.changesMade.next();
  }


  // Ranking methods
  getRankings(): string[][] {
    return this.rankings;
  }

  pushRanking(ranking: string[]){
    this.rankings.push(ranking);
    console.log(this.rankings);
    this.changesMade.next();
  }

  editRanking(index: number, ranking: string[]){
    this.rankings[index] = ranking;
    this.changesMade.next();
  }

  deleteRanking(index: number) {
    this.rankings.splice(index, 1);
    this.changesMade.next();
  }

  getRanking(index: number): string[]{
    return this.rankings[index];
  }

  isValidRanking(ranking: string[]): boolean {
    const sortedCandidates = this.sortStringArray(this.candidates.slice());
    const sortedRanking = this.sortStringArray(ranking.slice());
    let matchesCandidates = this.arrayEquals(sortedCandidates, sortedRanking);
    return matchesCandidates;
  }

  // For file upload

  validRankingSet(rankings: string[][]): boolean {
    if (rankings.length < 1) {
      return false;
    }
    let candidates = this.sortStringArray(rankings[0]);
    for (let ranking of rankings){
      if (!this.arrayEquals(this.sortStringArray(ranking), candidates)){
        return false;
      }
    }
    return true;
  }

  constructRankings(rankings: string[][]) {
    this.candidates = this.sortStringArray(rankings[0]);
    this.rankings = this.deepCopy(rankings);
    this.changesMade.next();
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

}
