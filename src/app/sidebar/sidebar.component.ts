import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  svc: RankingsService;

  links: string[][] = 
    [
      ["Kendall Distance", "kendall"],
      ["Borda Count", "borda"],
      ["Instant Runoff", "instant-runoff"],
      ["Topological Ordering", "topological"],
      ["Plurality (First Past The Post)", "plurality"],
      ["Kemeny Consensus", "kemeny"],
      ["Popular Ranking", "popular"],
    ]

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
  }
}
