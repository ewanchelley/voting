import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hl',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {

  @Input() bg: string = "grey";
  @Input() kendallWidth: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
