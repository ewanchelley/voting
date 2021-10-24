import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-rankings',
  templateUrl: './add-rankings.component.html',
  styleUrls: ['./add-rankings.component.css']
})
export class AddRankingsComponent implements OnInit {

  constructor() { }

  newRanking = "";
  newCandidate = "";

  candidates = ["A", "B", "C", "D"];
  //rankings = [["A","B","C","D"],
  //            ["B", "A", "C", "D"],
  //            ["A", "B", "C", "D"],
  //            ["D", "B", "C", "A"],
  //            ["A", "B", "C", "D"]];
  rankings = [[1, 2, 3, 0],
    [1, 2, 3, 0],
    [0, 1, 2, 3],
    [2, 1, 3, 0],
    [1, 0, 3, 2],];

  rankingStrings: string[] = []

  ngOnInit(): void {
    for (let r of this.rankings){
      this.rankingStrings.push(this.convertToString(r))
    }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addRanking() {
    let ranking = this.convertToArray(this.newRanking);
    console.log(ranking)
    if (this.isValidRanking(ranking)) {
      let indexRanking = this.convertToIndexArray(ranking);
      this.rankings.push(indexRanking);
      this.rankingStrings.push(this.convertToString(indexRanking));
      this.newRanking = "";
    }
    console.log(this.rankings)
    console.log(this.rankingStrings)
  }

  checkEditedRanking(index: number) {
    let ranking = this.convertToArray(this.rankingStrings[index]);
    if (this.isValidRanking(ranking)){
      let indexRanking = this.convertToIndexArray(ranking);
      this.rankings[index] = indexRanking;
    }
    this.rankingStrings[index] = this.convertToString(this.rankings[index]);
  }

  removeRanking(index: number){
    this.rankings.splice(index, 1);
    this.rankingStrings.splice(index, 1);
  }

  isValidRanking(ranking: string[]): boolean {
    const sortedCandidates = this.sortStringArray(this.candidates.slice());
    const sortedRanking = this.sortStringArray(ranking.slice());
    let matchesCandidates = this.arrayEquals(sortedCandidates, sortedRanking);
    return matchesCandidates;
  }

  addCandidate(){
    if (this.isValidCandidate(this.newCandidate)){
      this.candidates.push(this.newCandidate);
      this.newCandidate = "";
      this.rankings.map(r => (r.push(this.candidates.length - 1)));
      this.updateRankingStrings();
    }
  }

  isValidCandidate(candidate: string){
    let empty = candidate == "";
    let alreadyExists = this.candidates.includes(candidate);
    return !(empty || alreadyExists)
  }

  updateRankingStrings(){
    for (let i in this.rankings) {
      this.rankingStrings[i] = this.convertToString(this.rankings[i]);
    }
  }

  removeCandidate(index: number){
    console.log(this.rankings)
    this.candidates.splice(index, 1);
    // remove candidate of given index from each ranking

    let newRanking = this.rankings.map(r => (r.splice(r.indexOf(index), 1)));
    console.log(this.rankings)
    // decrement indexes bigger than index in each ranking
    newRanking = newRanking.map(r => (r.map(i => (i < index ? i: i-1))));
    this.updateRankingStrings();
    console.log(this.rankings)
    this.rankings = newRanking;
  }

  convertToString(r: number[]): string {
    let stringArray = r.map(x => (this.candidates[x]));
    return stringArray.join(",");
  }

  convertToArray(s: string): string[]{
    return s.replace(/\s/g, "").split(",");
  }

  convertToIndexArray(s: string[]): number[] {
    return s.map(x => (this.candidates.indexOf(x)));
  }

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


}
