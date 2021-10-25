import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-borda',
  templateUrl: './borda.component.html',
  styleUrls: ['./borda.component.css']
})
export class BordaComponent implements OnInit {

  svc: RankingsService;

  rankings: string[][] = []

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.svc.changesMade.subscribe(() => {
      this.rankings = this.svc.getRankings();
      console.log(this.rankings);
    });
  }
}
