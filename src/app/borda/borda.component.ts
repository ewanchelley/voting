import { Component, ElementRef, OnInit } from '@angular/core';
import { SelectMultipleControlValueAccessor } from '@angular/forms';
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

  bordaCount: { [candidate: string]: number[]} = {};
  bordaTotals: [string, number][] = [];

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  reCalculate(){
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.borda();
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  borda(){
    this.resetBordaArray();
    // For each ranking, assign points to candidates based on position in ranking
    for (let ranking of this.rankings){
      for (let i = 0; i < ranking.length; i++){
        let candidate = ranking[i];
        this.bordaCount[candidate][i] += 1;
      }
    }
    this.setTotals();
  }

  getPoints(candidate: string, index: number): number{
    return this.bordaCount[candidate][index] * (this.candidates.length - 1 - index)
  }

  getTotal(candidate: string): number{
    let total = 0;
    for(let i = 0; i < this.candidates.length; i++){
      total += this.getPoints(candidate, i)
    }
    return total;
  }

  setTotals() {
    this.bordaTotals = [];
    for(let candidate of this.candidates){
      this.bordaTotals.push([candidate, this.getTotal(candidate)]);
    }
    this.bordaTotals.sort((a,b) => b[1] - a[1]);
  }

  resetBordaArray(){
    this.bordaCount = {};
    for (let candidate of this.candidates){
      let rankings = [];
      for (let index in this.candidates){
        rankings.push(0);
      }
      this.bordaCount[candidate] = rankings;
    }
  }

  

  // returns false if the given rank ties with the one better
  isUniqueRank(i: number): boolean {
    if (i==0){
      return true;
    }
    return  (this.bordaTotals[i-1][1] !== this.bordaTotals[i][1])
  }
}
