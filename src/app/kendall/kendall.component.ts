import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-kendall',
  templateUrl: './kendall.component.html',
  styleUrls: ['./kendall.component.css']
})
export class KendallComponent implements OnInit {

  ranking1 = ["Candidate A", "Candidate B", "Candidate C", "Candidate D","Candidate E"];
  ranking2 = ["Candidate C", "Candidate E", "Candidate A", "Candidate D","Candidate B"];
  newCandidate = "";

  constructor() { }

  ngOnInit(): void {
  }

  kendall(r1: string[], r2: string[]): number {
    length = r1.length;
    let i, j, v = 0;
    let a: boolean, b: boolean;

    for (i = 0; i < length; i++) {
      for (j = i + 1; j < length; j++) {
        let n1 = r1[i];
        let n2 = r1[j];
        a = r1.indexOf(n1) < r1.indexOf(n2) && r2.indexOf(n1) > r2.indexOf(n2);
        b = r1.indexOf(n1) > r1.indexOf(n2) && r2.indexOf(n1) < r2.indexOf(n2);

        if (a || b){
          v++;
        }
      }
    }
    return v;
  }

  addCandidate(){
    if (this.newCandidate != "" && this.ranking1.indexOf(this.newCandidate) == -1){
      this.ranking1.push(this.newCandidate);
      this.ranking2.push(this.newCandidate);
      this.newCandidate = "";
    }
  }

  removeCandidate(s: string) {
    let index: number = this.ranking1.indexOf(s);
    if (index !== -1) {
      this.ranking1.splice(index, 1);
    }
    index = this.ranking2.indexOf(s);
    if (index !== -1) {
      this.ranking2.splice(index, 1);
    }
  }

  getSortedCandidates(): string[] {
    return this.ranking1.slice().sort((n1, n2) => {
      if (n1 > n2) {
        return 1;
      }

      if (n1 < n2) {
        return -1;
      }

      return 0;
    });
  }

}
