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
  rankings: string[][] = [];

  disagreements: string[][] = [];

  newCandidate = "";
  indexes = [1,2,3,4,5]

  colors = []

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
    this.rankings = this.svc.getKendallRankings();
    this.candidates = this.svc.getCandidates();
  }

  kendall() {
    let disagreements = this.svc.kendallDisagreements(this.rankings[0], this.rankings[1]);
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

}
