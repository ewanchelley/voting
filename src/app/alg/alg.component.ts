import { Component, Input, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-alg',
  templateUrl: './alg.component.html',
  styleUrls: ['./alg.component.css']
})
export class AlgComponent implements OnInit {

  @Input() title: string = "";
  @Input() link: string = "";
  @Input() isLearn: boolean = false;

  svc: RankingsService;

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
  }

  showNoRankings() {
    return this.svc.getRankings().length == 0 && !this.isLearn;
  }

  showNoCandidates() {
    return this.svc.getCandidates().length == 0 && !this.isLearn;
  }

}
