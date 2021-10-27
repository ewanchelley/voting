import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-borda',
  templateUrl: './borda.component.html',
  styleUrls: ['./borda.component.css']
})
export class BordaComponent implements OnInit {

  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

  bordaCount: { [candidate: string]: number} = {};

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.svc.changesMade.subscribe(() => {
      this.rankings = this.svc.getRankings();
      this.candidates = this.svc.getCandidates();
    });
  }

  borda(){
    // Initialise each candidate with 0 points
    for (let candidate of this.candidates){
      this.bordaCount[candidate] = 0;
    }
    // For each ranking, assign points to candidates based on position in ranking
    for (let ranking of this.rankings){
      for (let i = 0; i < ranking.length; i++){
        let points = ranking.length - i - 1;
        this.bordaCount[ranking[i]] += points;
      }
    }
    console.log(this.bordaCount);
  }
}
