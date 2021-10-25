import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-add-rankings',
  templateUrl: './add-rankings.component.html',
  styleUrls: ['./add-rankings.component.css']
})
export class AddRankingsComponent implements OnInit {

  newCandidate = "";
  newRanking = "";
  
  // these are binded to the input boxes
  candidateStrings: string[] = []
  rankingStrings: string[] = []
  
  svc: RankingsService;

  candidates: string[] = []
  rankings: string[][] = []

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.candidates = this.svc.getCandidates();
    this.rankings = this.svc.getRankings();
    this.svc.changesMade.subscribe(() => {
      this.candidates = this.svc.getCandidates();
      this.rankings = this.svc.getRankings();
      console.log("changes");
    });

    this.candidateStrings = this.candidates.slice();
    this.rankings.forEach(r => (this.rankingStrings.push(this.convertToString(r))));
  }


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addRanking() {
    let ranking = this.convertToArray(this.newRanking);
    console.log(ranking)
    if (this.svc.isValidRanking(ranking)) {
      this.svc.pushRanking(ranking);
      this.rankingStrings.push(this.convertToString(ranking));
      this.newRanking = "";
    }
  }

  checkEditedRanking(index: number) {
    let ranking = this.convertToArray(this.rankingStrings[index]);
    if (this.svc.isValidRanking(ranking)){
      this.svc.editRanking(index, ranking);
    }
    this.rankingStrings[index] = this.convertToString(this.rankings[index]);
  }

  removeRanking(index: number){
    this.svc.deleteRanking(index);
    this.rankingStrings.splice(index, 1);
  }

  addCandidate(){
    if (this.svc.isValidCandidate(this.newCandidate)){
      this.svc.pushCandidate(this.newCandidate);
      this.candidateStrings.push(this.newCandidate);
      this.svc.addCandidateToAllRankings(this.newCandidate);
      this.newCandidate = "";
      this.updateRankingStrings();
    }
  }

  checkEditedCandidate(index: number) {
    let candidate = this.candidateStrings[index];
    if (this.svc.isValidCandidate(candidate)) {
      this.svc.updateCandidateName(index, candidate);
    }
    this.candidateStrings[index] = this.candidates[index];
    this.updateRankingStrings();
  }

  updateRankingStrings() {
    for (let i in this.rankings) {
      this.rankingStrings[i] = this.convertToString(this.rankings[i]);
    }
  }

  removeCandidate(index: number){
    this.svc.deleteCandidate(index);
    this.candidateStrings.splice(index, 1);
    this.updateRankingStrings();
  }

  quickAdd(candidate: string){
    let clean = this.newRanking.replace(/\s/g, "")
    if (clean === "" || clean.substr(clean.length - 1) === ","){
      this.newRanking += candidate;
    } else {
      this.newRanking += ", " + candidate;
    }
  }

  convertToString(r: string[]): string {
    return r.join(", ");
  }

  convertToArray(s: string): string[]{
    return s.replace(/\s/g, "").split(",");
  }

}
