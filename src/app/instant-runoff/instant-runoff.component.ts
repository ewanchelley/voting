import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-instant-runoff',
  templateUrl: './instant-runoff.component.html',
  styleUrls: ['./instant-runoff.component.css']
})
export class InstantRunoffComponent implements OnInit {

  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

  roundTotals: [string, number][][] = [];

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  trackByIndex(index: number, obj: any): any {
    return index;
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
    this.roundTotals = this.runoff(this.candidates, this.rankings);
  }

  runoff(candidates: string[], rankings: string[][]) {
    let numVoters = rankings.length
    let majority = false;
    let eliminated: string[] = [];
    let totals: [string, number][][] = []
    while (!majority && eliminated.length < candidates.length - 1){
      let tallys: { [candidate: string]: number } = {};
      candidates.forEach(c => {if (eliminated.indexOf(c) == -1) {tallys[c] = 0; }});
      rankings.forEach(r => tallys[this.firstNonEliminated(r, eliminated)]++);
      let result: [string, number][] = [];
      candidates.forEach(c => { if (eliminated.indexOf(c) == -1) {result.push([c, tallys[c]])}})
      result.sort((a, b) => b[1] - a[1]);
      totals.push(result);
      if (result[0][1] > numVoters / 2){
        majority = true; 
      } else {
        eliminated.push(result[result.length - 1][0]);
      }
    }
    return totals;
  }

  firstNonEliminated(r: string[], eliminated: string[]): string{
    for (let candidate of r){
      if (eliminated.indexOf(candidate) == -1){
        return candidate;
      }
    }
    return "ERROR";
  }

  getRoundText(index: number){
    return `Round ${index + 1}`;
  }

  firstChoiceVotes(candidate: string): number{
    for (let c of this.roundTotals[0]){
      if (c[0] === candidate){
        return c[1];
      }
    }
    return 0;
  }
}
