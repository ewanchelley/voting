import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {

  @Input() heading: string = "";
  @Input() bg: string = "bg-light";

  constructor() { }

  ngOnInit(): void {
  }

}
