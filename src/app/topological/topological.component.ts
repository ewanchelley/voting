import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import vis, { Network, DataSet } from 'vis';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-topological',
  templateUrl: './topological.component.html',
  styleUrls: ['./topological.component.css']
})
export class TopologicalComponent implements OnInit {

  @ViewChild('majority') el!: ElementRef;
  networkInstance: any;
  svc: RankingsService;

  candidates: string[] = [];
  rankings: string[][] = [];

  majorityGraphOptions = {
    layout: {
      improvedLayout: true,
      hierarchical: { enabled: false, nodeSpacing: 300 }
    },
    interaction: { hover: true },
    manipulation: { enabled: true },
    physics: { stabilization: { fit: true } },
    edges: {
      arrows: {
        middle: true
      }
    }
  };

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    
  }

  reCalculate() {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.constructMajority();
  }

  ngAfterViewInit() {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  // naive majority construction?
  constructMajority(){
    let i,j = 0;
    const length = this.candidates.length;
    let numRankings: number[][] = []
    let preferred: number[][] = []

    // initialise preferred with zeros
    for (let a = 0; a< length; a++){
      preferred.push(new Array(length).fill(0));
    }

    // convert rankings to numeric rankings
    for (let ranking of this.rankings){
      let numRanking = ranking.map(candidate => this.candidates.indexOf(candidate))
      numRankings.push(numRanking);
    }

    // loop through permutations of candidates for each ranking
    for (let ranking of numRankings){
      for (i = 0; i < length; i++) {
        for (j = i + 1; j < length; j++) {
          let c1 = ranking[i];
          let c2 = ranking[j];
          preferred[c1][c2]++;
        }
      }
    }

    let edges: [number, number][] = [];
    for (i = 0; i < length; i++) {
      for (j = i + 1; j < length; j++) {
        let preference = preferred[i][j] - preferred[j][i];
        if (preference > 0){
          //i preferred to j
          edges.push([i,j]);
        } else if (preference < 0){
          edges.push([j,i]);
        }
      }
    }

    this.constructMajorityGraph(edges);
  }

  constructMajorityGraph(eList: [number, number][]){
    const container = this.el.nativeElement;

    let nodesData = this.candidates.map(c => ({id: this.candidates.indexOf(c), label: c}));
    const nodes = new DataSet<any>(nodesData);

    let edgesData = eList.map(e =>  ({from: e[0], to: e[1]}));
    const edges = new DataSet<any>(edgesData);

    const data = { nodes, edges };

    this.networkInstance = new Network(container, data, this.majorityGraphOptions);
  }

}
