import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-ranking-offcanvas',
  templateUrl: './ranking-offcanvas.component.html',
  styleUrls: ['./ranking-offcanvas.component.css']
})
export class RankingOffcanvasComponent implements OnInit {

  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

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

}
