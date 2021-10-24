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
  rankings = [["A","B","C","D"]]
  //            ["B", "A", "C", "D"],
  //            ["A", "B", "C", "D"],
  //            ["D", "B", "C", "A"],
  //            ["A", "B", "C", "D"]];
  

  ranking_strings: string[] = []

  ngOnInit(): void {
    for (let r of this.rankings){
      this.ranking_strings.push(r.toString())
    }
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addRanking() {
    let ranking = this.convertToArray(this.newRanking);
    console.log(ranking)
    if (this.isValidRanking(ranking)) {
      this.rankings.push(ranking);
      this.ranking_strings.push(ranking.toString());
      this.newRanking = "";
    }
    console.log(this.rankings)
    console.log(this.ranking_strings)
  }

  checkEditedRanking(index: number) {
    let ranking = this.convertToArray(this.ranking_strings[index]);
    if (this.isValidRanking(ranking)){
      this.rankings[index] = ranking;
    }
    this.ranking_strings[index] = this.rankings[index].toString();
  }

  removeRanking(index: number){
    this.rankings.splice(index, 1);
    this.ranking_strings.splice(index, 1);
  }

  isValidRanking(ranking: string[]): boolean {
    const sortedCandidates = this.sortStringArray(this.candidates.slice());
    const sortedRanking = this.sortStringArray(ranking.slice());
    let matchesCandidates = this.arrayEquals(sortedCandidates, sortedRanking);

    console.log("matches candidates: " + matchesCandidates)

    return matchesCandidates;
  }

  addCandidate(){
    if (this.isValidCandidate(this.newCandidate)){
      this.candidates.push(this.newCandidate);
      this.newCandidate = "";
    }
  }

  isValidCandidate(candidate: string){
    let empty = candidate == "";
    let alreadyExists = this.candidates.includes(candidate);
    return !(empty || alreadyExists)
  }

  removeCandidate(index: number){
    this.candidates.splice(index, 1);
  }



  convertToArray(s: string): string[]{
    return s.replace(/\s/g, "").split(",");
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
