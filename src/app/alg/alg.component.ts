import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alg',
  templateUrl: './alg.component.html',
  styleUrls: ['./alg.component.css']
})
export class AlgComponent implements OnInit {

  @Input() title: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
