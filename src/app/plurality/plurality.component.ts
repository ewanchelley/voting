import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-plurality',
  templateUrl: './plurality.component.html',
  styleUrls: ['./plurality.component.css']
})
export class PluralityComponent implements OnInit {

  svc: RankingsService;

  totals: [string, number][] = [];

  candidates: string[] = [];
  rankings: string[][] = [];

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
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.plurality();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  plurality(){
    this.resetTotals();
    let tallys: { [candidate: string]: number } = {};
    this.candidates.forEach(c => tallys[c] = 0);
    this.rankings.forEach(r => tallys[r[0]]++);
    this.candidates.forEach(c => this.totals.push([c, tallys[c]]))
    this.totals.sort((a, b) => b[1] - a[1]);
  }

  resetTotals(){
    this.totals = [];
  }

  // returns false if the given rank ties with the one better
  isUniqueRank(i: number): boolean {
    if (i == 0) {
      return true;
    }
    return (this.totals[i - 1][1] !== this.totals[i][1])
  }

  round(i: number){
    return Math.round(i);
  }

}
