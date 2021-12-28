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

  order: string[] = [];
  orderText: string = "";

  nodes!: DataSet<any>;
  edges!: DataSet<any>;

  legend = ["Scroll to zoom",
            "Drag to move canvas",
            "Drag to move nodes"]

  majorityGraphOptions = {
    layout: {
      improvedLayout: true,
      hierarchical: { enabled: false, nodeSpacing: 300 }
    },
    edges: {
      arrows: {
        to: true
      },
      smooth: { enabled: true, type: 'continuous', roundness: 0}
    },
    interaction: { hover: true, dragView: true, zoomView: true },
    manipulation: { enabled: false },
    physics: false,
    
  };

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    
  }

  reCalculate() {
    this.rankings = this.svc.getRankings();
    this.candidates = this.svc.getCandidates();
    this.order = this.topological();
    this.orderText = this.svc.convertToString(this.order);
    console.log(this.order);
  }

  ngAfterViewInit() {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  orderExists(){
    return this.order.length != 0;
  }

  topological() {
    let edges = this.constructMajority();
    let L = [];
    let Q = [];
    let nodes = [];

    for (let i = 0; i < this.candidates.length; i++) {
      let incoming: Set<number> = new Set();
      let outgoing: Set<number> = new Set();
      let node = {incoming:incoming, outgoing:outgoing}
      nodes.push(node);
    }

    for (let edge of edges) {
      let start = edge[0];
      let end = edge[1];
      nodes[start].outgoing.add(end);
      nodes[end].incoming.add(start);
    }

    // Set Q to be list of nodes with no incoming edges
    
    for (let i = 0; i < this.candidates.length; i++) {
      if (nodes[i].incoming.size == 0){
        Q.push(i);
      }
    }

    while(Q.length > 0){
      let n: number = Q.pop()!;
      L.push(n);
      for (let out of nodes[n].outgoing){
        nodes[out].incoming.delete(n);
        if (nodes[out].incoming.size == 0){
          Q.push(out);
        }
      }
    }
    if (L.length < nodes.length){
      // Graph contained a cycle, no topological ordering
      return [];
    }
    return L.map(node => this.candidates[node])
  }

  
  constructMajority(): [number, number][]{
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
      let numRanking = ranking.map(candidate => this.candidates.indexOf(candidate));
      numRankings.push(numRanking);
    }

    // loop through permutations of candidates for each ranking O(C^2R)
    for (let ranking of numRankings){
      for (i = 0; i < length; i++) {
        for (j = i + 1; j < length; j++) {
          let c1 = ranking[i];
          let c2 = ranking[j];
          preferred[c1][c2]++;
        }
      }
    }

    // create edge from a to b wherever a is preferred over b by majority
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
    return edges;
  }

  constructMajorityGraph(eList: [number, number][]){
    let nodesData = this.candidates.map(c => ({id: this.candidates.indexOf(c), label: c}));
    this.nodes = new DataSet<any>(nodesData);

    let edgesData = eList.map(e =>  ({from: e[0], to: e[1]}));
    this.edges = new DataSet<any>(edgesData);

    this.drawGraph(this.nodes, this.edges);
  }

  drawGraph(nodes: DataSet<any>, edges: DataSet<any>){
    const container = this.el.nativeElement;
    const data = { nodes, edges };
    this.networkInstance = new Network(container, data, this.majorityGraphOptions);
    this.networkInstance.on("click", this.onClickCanvas);
  }

  onClickCanvas(params: any) {
    if (params.nodes.length <= 0){
      // node was node selected
      return;
    }
    let selectedNode: number = params.nodes[0];
    console.log(selectedNode)
    console.log(params.edges)
  }
}
