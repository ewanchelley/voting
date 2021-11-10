import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RankingsService } from '../rankings.service';

@Component({
  selector: 'app-add-rankings',
  templateUrl: './add-rankings.component.html',
  styleUrls: ['./add-rankings.component.css']
})
export class AddRankingsComponent implements OnInit {

  newCandidate = "";
  newRanking = "";
  
  // these are binded to the input boxes
  candidateStrings: string[] = []
  rankingStrings: string[] = []
  
  svc: RankingsService;

  candidates: string[] = []
  rankings: string[][] = []

  fileToUpload: File | null = null;
  validFile = false;
  rankingsFromFile: string[][] = [];

  constructor(svc: RankingsService) {
    this.svc = svc;
  }

  ngOnInit(): void {
    this.candidates = this.svc.getCandidates();
    this.rankings = this.svc.getRankings();
    this.svc.changesMade.subscribe(() => {
      this.candidates = this.svc.getCandidates();
      this.rankings = this.svc.getRankings();
    });

    this.candidateStrings = this.candidates.slice();
    this.rankings.forEach(r => (this.rankingStrings.push(this.convertToString(r))));
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addRanking() {
    let ranking = this.convertToArray(this.newRanking);
    console.log(ranking)
    if (this.svc.isValidRanking(ranking)) {
      this.addValidRanking(ranking);
    }
  }

  addValidRanking(ranking: string[]){
    this.svc.pushRanking(ranking);
    this.rankingStrings.push(this.convertToString(ranking));
    this.newRanking = "";
    setTimeout(this.scrollToBottom, 100)
    
  }

  checkEditedRanking(index: number) {
    let ranking = this.convertToArray(this.rankingStrings[index]);
    if (this.svc.isValidRanking(ranking)){
      this.svc.editRanking(index, ranking);
    }
    this.rankingStrings[index] = this.convertToString(this.rankings[index]);
  }

  removeRanking(index: number){
    this.svc.deleteRanking(index);
    this.rankingStrings.splice(index, 1);
  }

  addCandidate(){
    if (this.svc.isValidCandidate(this.newCandidate)){
      this.svc.pushCandidate(this.newCandidate);
      this.candidateStrings.push(this.newCandidate);
      this.svc.addCandidateToAllRankings(this.newCandidate);
      this.newCandidate = "";
      this.updateRankingStrings();
    }
  }

  checkEditedCandidate(index: number) {
    let candidate = this.candidateStrings[index];
    if (this.svc.isValidCandidate(candidate)) {
      this.svc.updateCandidateName(index, candidate);
    }
    this.candidateStrings[index] = this.candidates[index];
    this.updateRankingStrings();
  }

  updateRankingStrings() {
    for (let i in this.rankings) {
      this.rankingStrings[i] = this.convertToString(this.rankings[i]);
    }
  }

  removeCandidate(index: number){
    this.svc.deleteCandidate(index);
    this.candidateStrings.splice(index, 1);
    this.updateRankingStrings();
  }

  quickAdd(candidate: string){
    let clean = this.newRanking.trim();
    if (clean === "" || clean.substr(clean.length - 1) === ","){
      this.newRanking += candidate;
    } else {
      this.newRanking += ", " + candidate;
    }
  }

  addRandomRanking(){
    let candidatesToShuffle = this.candidates.slice();
    let randomRanking = this.shuffle(candidatesToShuffle);
    this.addValidRanking(randomRanking);
  }

  shuffle(ranking: string[]) {
    let currentIndex = ranking.length;
    let randomIndex;

    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [ranking[currentIndex], ranking[randomIndex]] = [ranking[randomIndex], ranking[currentIndex]];
    }
    return ranking;
  }

  handleFileInput() {
    this.validFile = false;
    let files = (<HTMLInputElement>document.getElementById("formFile")).files;
    if (files === null){
      return;
    }
    this.fileToUpload = files[0];

    if (this.fileToUpload === (null || undefined) || this.getFileType(this.fileToUpload.name) !== "txt") {
      return;
    }

    let reader = new FileReader();

    reader.onload = () => { 
      this.rankingsFromFile = [];
      let txtFile = reader.result;
      if (typeof(txtFile) === 'string'){
        this.processFile(txtFile);
      }
    };
    reader.readAsText(this.fileToUpload);
  }

  processFile(txtFile: string){
    let lines: string[] = txtFile.split("\n");
    let rankings: string[][] = lines.map(l => (this.convertToArray(l)));
    if (this.svc.validRankingSet(rankings)){
      this.validFile = true;
      this.rankingsFromFile = rankings;
    } else {
      console.log("Invalid ranking set");
    }
  }

  constructRankings(){
    this.svc.constructRankings(this.rankingsFromFile);
    this.candidateStrings = this.candidates.slice();
    this.updateRankingStrings();
  }

  scrollToBottom(){
    var element = document.getElementById("inputScroll");
    if (element){
      element.scrollTop = element.scrollHeight;
    }
  }

  // Helper methods

  getFileType(fileName: string){
    return fileName.split('.').pop();
  } 

  convertToString(r: string[]): string {
    return r.join(", ");
  }

  convertToArray(s: string): string[]{
    let arr = s.split(",");
    arr = arr.map(x => x.trim())
    return arr;
  }
}
