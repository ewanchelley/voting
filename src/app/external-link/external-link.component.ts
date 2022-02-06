import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lnk',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.css']
})
export class ExternalLinkComponent implements OnInit {

  @Input() link: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
