import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  @Input() rankingString: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
