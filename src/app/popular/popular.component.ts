import { Component, OnInit } from '@angular/core';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrls: ['./popular.component.css']
})
export class PopularComponent implements OnInit {

  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

  //kemenyConsensus: string[] = [];
  //kemenyScore: number = 0;

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  reCalculate() {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.weakly();
  }

  weakly() {

    // change later, for now set proposed rankings as first ranking
    let R0 = this.rankings[0];

    let solver = require("javascript-lp-solver");
    let results;
    let model: string[] = [];

    let m = this.candidates.length;
    let n = this.rankings.length;

    

    // OBJECTIVE FUNCTION

    // Set the objective function
    let objective = "max:";
    for (let i = 1; i <= n; i++) {
      objective += ` +p${i}`;
    }
    model.push(objective);

    // SET Ki and Ri

    // Set Ki
    let K = this.getKendalls(R0);
    for(let i = 1; i <= n; i++){
      model.push(`K${i} = ${K[i-1]}`);
    }

    
    // Set Ri{r,s} for all i
    for(let i = 1; i <= n; i++){
      for (let r = 0; r < m; r++) {
        for (let s = r + 1; s < m; s++) {
          let r_candidate = this.candidates[r];
          let s_candidate = this.candidates[s];
          let r_before_s = this.rankings[i-1].indexOf(r_candidate) < this.rankings[i-1].indexOf(s_candidate);
          if(r_before_s){
            model.push(`R${i}_${r}_${s} = 1`);
          } else {
            model.push(`R${i}_${r}_${s} = 0`);
          }
        }
      }
    }

    // VALID RANKING CONSTRAINTS

    // Add constraint 0 <= x{r,s} <=1
    for (let r = 0; r < m; r++) {
      for (let s = 0; s < m; s++) {
        if (r != s) {
          model.push(`0 <= x${r}_${s} <= 1`);
        }
      }
    }

    // Add constraint x{r,s} + x{s,r} = 1
    for (let r = 0; r < m; r++) {
      for (let s = r + 1; s < m; s++) {
        model.push(`x${r}_${s} + x${s}_${r} = 1`);
      }
    }

    
    // Add constraint x{r,s} + x{s,t} + x{t,r} >= 1
    for (let r = 0; r < m; r++) {
      for (let s = 0; s < m; s++) {
        for (let t = 0; t < m; t++) {
          if (r != s && s != t && r != t) {
              //model.push(`x${r}_${s} + x${s}_${t} + x${t}_${r} >= 1`);
              model.push(`x${r}_${t} - x${r}_${s} - x${s}_${t} >= -1`);
          }
        }
      }
    }
    
  
  

    // CONSTRAINTS FOR k{i,r,s} and KiPRIME

    // Add constraint for k{i,r,s}
    for (let i = 1; i <= n; i++) {
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          // Ensure k{i,r,s} = 1 if the r,s orders are different and 0 otherwise
          model.push(`0 <= k${i}_${r}_${s} <= 1`);
          model.push(`x${r}_${s} - R${i}_${r}_${s} - k${i}_${r}_${s} <= 0`);
          model.push(`R${i}_${r}_${s} - x${r}_${s} - k${i}_${r}_${s} <= 0`);
          model.push(`x${r}_${s} + R${i}_${r}_${s} - k${i}_${r}_${s} >= 0`);
          model.push(`x${r}_${s} + R${i}_${r}_${s} + k${i}_${r}_${s} <= 2`);
        }
      }
    }

    

    // KiPRIME = SUM{k{i,r,s}} for each i
    for (let i = 1; i <= n; i++) {
      let constraint = `K${i}PRIME`
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          constraint += ` -k${i}_${r}_${s}`;
        }
      }
      constraint += ` = 0`
      model.push(constraint);
    }


    // COUNT TIMES R preferred to R_0

    // Constraints for p{i}
    
    // maxKendall = m(m-1)/2
    let maxKendall = (m * (m-1))/2

    for (let i = 1; i <= n; i++) {
      //p{i} is 1 if R preferred, 0 otherwise
      model.push(`0<= p${i} <= 1`)
      model.push(`p${i} - ${1 / maxKendall} K${i} + ${1 / maxKendall} K${i}PRIME >=  0`);
      model.push(`K${i} - K${i}PRIME - ${maxKendall + 1} p${i} >= -${maxKendall}`);
    }

    
    // ENFORCE INTEGERS FOR ALL VARIABLES

    // Enforce int for p{i}
    for(let i = 1; i <= n; i++){
      model.push(`int p${i}`)
    }

    // Enforce int for x{r,s}
    for (let r = 0; r < m; r++) {
      for (let s = 0; s < m; s++) {
        if (r != s) {
          model.push(`int x${r}_${s}`);
        }
      }
    }

    
    // Enforce int for k{i,r,s}
    for (let i = 1; i <= n; i++) {
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          model.push(`int k${i}_${r}_${s}`);
        }
      }
    }

    // Enforce int for Ri{r,s}
    for (let i = 1; i <= n; i++) {
      for (let r = 0; r < m; r++) {
        for (let s = r+1; s < m; s++) {
          model.push(`int R${i}_${r}_${s}`);
        }
      }
    }

    // Enforce int for Ki
    for (let i = 1; i <= n; i++) {
      model.push(`int K${i}`);
    }

    // Enforce int for KiPRIME
    for (let i = 1; i <= n; i++) {
      model.push(`int K${i}PRIME`);
    }

    console.log(model);
    model = solver.ReformatLP(model);
    console.log(model)
    results = solver.Solve(model);
    console.log(results);

 
    // Construct rankings by counting number of times each candidate
    // is preferred over some another and then sorting totals
    let timesPref = new Array(length).fill(0);
    for (let result of Object.keys(results)) {
      if (result[0] === "x") {
        let ids = result.slice(1).split("_");
        timesPref[+ids[0]] += 1;
      }
    }
    let alt = this.candidates.slice();
    alt = alt.sort((a, b) => timesPref[this.candidates.indexOf(b)] - timesPref[this.candidates.indexOf(a)])
    console.log(alt)

    //this.kemenyConsensus = this.candidates.slice();
    //this.kemenyConsensus = this.kemenyConsensus.sort((a, b) => timesPref[this.candidates.indexOf(b)] - timesPref[this.candidates.indexOf(a)])
    //this.kemenyScore = results.result;
    
  }

  getKendalls(R0: string[]): number[] {
    let Ki = [];
    for(let Ri of this.rankings){
      Ki.push(this.kendall(R0, Ri));
    }
    return Ki;
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

        if (a || b) {
          v++;
        }
      }
    }
    return v;
  }

  round(i: number) {
    return Math.round(i);
  }

}
