import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  svc: RankingsService;

  algLinks: string[][] = 
    [
      ["Plurality (First Past The Post)", "plurality"],
      ["Borda Count", "borda"],
      ["Instant Runoff", "instant-runoff"],
      ["Kendall Distance", "kendall"],
      ["Kemeny Consensus", "kemeny"],
      ["Topological Ordering", "topological"],
      ["Popular Ranking", "popular"],
    ]

  criteriaLinks: string[][] =
    [
      ["Condorcet", "condorcet"],
    ]

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  dangerousLinkExists(): boolean {
    for (let alg of this.algLinks) {
      if (this.svc.isDangerous(alg[1])){
        return true;
      }
    }
    return false;
  }

  ngOnInit(): void {
  }
}
