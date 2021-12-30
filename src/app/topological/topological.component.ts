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

  results: string[][] = [];
  resultText: string = "";
  numResults: number = 0;

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
    this.results = this.topological();
    this.numResults = this.results.length;
    if (this.results.length > 0){
      this.resultText = this.svc.convertToString(this.results[0]);
    }
  }

  ngAfterViewInit() {
    this.reCalculate();
    this.svc.changesMade.subscribe(() => {
      this.reCalculate();
    });
  }

  topological(): string[][] {
    let edges = this.constructMajority();
    let L: number[] = [];
    let Q: number[] = [];
    let nodes = [];

    // Initialise nodes and edges
    for (let i = 0; i < this.candidates.length; i++) {
      let incoming: Set<number> = new Set();
      let outgoing: Set<number> = new Set();
      let node = { incoming: incoming, outgoing: outgoing }
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
      if (nodes[i].incoming.size == 0) {
        Q.push(i);
      }
    }

    if (Q.length > 0){
      let nodesCopy: any[] = [];
      nodes.forEach(n => (nodesCopy.push({ incoming: new Set(n.incoming), outgoing: new Set(n.outgoing)})));
      let results = this.recursiveTopological(L.slice(), Q.slice(), nodesCopy);
      return results.map(r => (r.map(node => this.candidates[node])));
    } else {
      return [];
    }
  }

  recursiveTopological(L: number[], Q: number[], nodes: any[]): number[][] {
    let results: number[][] = [];
    for (let i = 0; i < Q.length; i++){
      let newQ = Q.slice();
      let next = newQ.splice(i, 1)[0];
      let newL = L.slice();
      newL.push(next);
      let newNodes: any[] = [];
      nodes.forEach(n => (newNodes.push({ incoming: new Set(n.incoming), outgoing: new Set(n.outgoing) })));
      
      for (let out of newNodes[next].outgoing){
        newNodes[out].incoming.delete(next);
        if (newNodes[out].incoming.size == 0) {
          newQ.push(out);
        }
      }

      if (newQ.length > 0){
        let recursiveResults = this.recursiveTopological(newL, newQ, newNodes);
        if (recursiveResults.length == 0){
          // If recursive call return empty array, no topological order exists
          return [];
        }
        results = results.concat(recursiveResults);
      } else if (newL.length < newNodes.length){
        // Graph contained a cycle, no topological ordering
        return [];
      } else {
        return [newL];
      }
    }
    
    return results;
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
