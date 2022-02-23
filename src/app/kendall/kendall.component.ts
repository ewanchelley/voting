import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';


@Component({
  selector: 'app-kendall',
  templateUrl: './kendall.component.html',
  styleUrls: ['./kendall.component.css']
})
export class KendallComponent implements OnInit {

  svc: RankingsService;
  
  candidates: string[] = [];
  kendallRankings: string[][] = [];
  votersRankings: string[][] = [];

  disagreements: string[][] = [];

  newCandidate = "";
  indexes = [1,2,3,4,5]

  colors = []

  proposedString: string = "";
  proposed: string[] = [];
  formattedProposedString: string = "";

  distancesToVoters: number[] = [];

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
    this.kendallRankings = this.svc.getKendallRankings();
    this.candidates = this.svc.getCandidates();
    this.votersRankings = this.svc.getRankings();
  }

  kendall() {
    let disagreements = this.svc.kendallDisagreements(this.kendallRankings[0], this.kendallRankings[1]);
    this.disagreements = disagreements;
    return disagreements.length;
  }

  getColorByName(s: string): string {
    let colors = ["red", "green", "blue", "yellow", "purple"]
    let pos = this.candidates.indexOf(s);
    if (pos == undefined){
      return "grey";
    }
    return colors[pos % colors.length];
  }

  // Methods for Ranking input

  checkProposed() {
    let proposedRanking = this.svc.convertToArray(this.proposedString);
    if (this.svc.isValidRanking(proposedRanking, true)) {
      this.proposed = proposedRanking;
      this.formattedProposedString = this.svc.convertToString(this.proposed);
      //calc to all
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

  tryRandom() {
    let candidatesToShuffle = this.candidates.slice();
    let randomRanking = this.svc.shuffle(candidatesToShuffle);
    this.proposedString = this.svc.convertToString(randomRanking);
    this.checkProposed();
  }

  showResults() {
    return this.proposed.length > 0;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }
}
