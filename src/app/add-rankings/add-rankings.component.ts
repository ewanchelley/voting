import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrModule, ToastrService } from 'ngx-toastr';
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
  toastr: ToastrService;

  candidates: string[] = []
  rankings: string[][] = []

  fileToUpload: File | null = null;
  validFile = false;
  rankingsFromFile: string[][] = [];

  numRandomVoters: number = 10;
  numRandomCandidates: number = 5;
  keepCandidates: boolean = true;

  constructor(svc: RankingsService, toastr: ToastrService) {
    this.svc = svc;
    this.toastr = toastr;
  }

  ngOnInit(): void {
    this.candidates = this.svc.getCandidates();
    this.rankings = this.svc.getRankings();
    this.svc.changesMade.subscribe(() => {
      this.candidates = this.svc.getCandidates();
      this.rankings = this.svc.getRankings();
    });

    this.candidateStrings = this.candidates.slice();
    this.rankings.forEach(r => (this.rankingStrings.push(this.svc.convertToString(r))));
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  addRanking() {
    let ranking = this.svc.convertToArray(this.newRanking);
    console.log(ranking)
    if (this.svc.isValidRanking(ranking, true)) {
      this.addValidRanking(ranking);
    }
  }

  addValidRanking(ranking: string[]){
    console.log("new ranking")
    console.log(ranking)
    this.svc.pushRanking(ranking);
    this.rankingStrings.push(this.svc.convertToString(ranking));
    this.newRanking = "";
    setTimeout(this.scrollToBottom, 100)
    
  }

  checkEditedRanking(index: number) {
    let ranking = this.svc.convertToArray(this.rankingStrings[index]);
    if (this.svc.isValidRanking(ranking)){
      this.svc.editRanking(index, ranking);
    }
    this.rankingStrings[index] = this.svc.convertToString(this.rankings[index]);
  }

  removeRanking(index: number){
    this.svc.deleteRanking(index);
    this.rankingStrings.splice(index, 1);
  }

  addCandidate(){
    if (this.svc.isValidCandidate(this.newCandidate, true)){
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
    this.rankingStrings = []
    this.rankings.forEach(r => (this.rankingStrings.push(this.svc.convertToString(r))));
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
    let randomRanking = this.svc.shuffle(candidatesToShuffle);
    this.addValidRanking(randomRanking);
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
    let rankings: string[][] = lines.map(l => (this.svc.convertToArray(l)));
    if (this.svc.validRankingSet(rankings)){
      this.validFile = true;
      this.rankingsFromFile = rankings;
    } else {
      this.svc.displayToast("The file uploaded was invalid or incorrectly formatted.","Invalid File");
    }
  }

  downloadRankings() {
    let file = this.svc.constructFile();
    let a = document.createElement("a");
    let url = URL.createObjectURL(file);
    a.href = url;
    a.download = "voters-rankings";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  constructRankings(rankings: string[][]){
    this.svc.constructRankings(rankings);
    this.candidateStrings = this.candidates.slice();
    this.updateRankingStrings();
  }

  constructRankingsPremade(name: string){
    this.svc.constructRankingsPremade(name);
    this.candidateStrings = this.candidates.slice();
    this.updateRankingStrings();
  }

  scrollToBottom(){
    var element = document.getElementById("rankingScroll");
    if (element){
      element.scrollTop = element.scrollHeight;
    }
  }

  generateRandom() {
    // Generate candidates or use current ones
    let maxCandidates = 676 // 26^2
    let candidates: string[] = []
    let rankings: string[][] = [];
    if (!this.keepCandidates){
      if (this.numRandomCandidates > maxCandidates || this.numRandomCandidates < 1){
        return;
      }
      else {
        for (let i = 0; i < this.numRandomCandidates; i++){
          let digit2 = i % 26;
          let digit1 = ((i - digit2) / 26) - 1;
          let l2 = String.fromCharCode(65 + digit2);
          let l1 = digit1 == -1 ? "" : String.fromCharCode(65 + digit1);
          candidates.push(l1 + l2);
        }
          
      }
    } else {
      candidates = this.candidates.slice();
    }

    // Generate rankings
    for (let i = 0; i < this.numRandomVoters; i++){
      let randomRanking = this.svc.shuffle(candidates.slice());
      rankings.push(randomRanking);
    }
    this.constructRankings(rankings);
  }

  // Helper methods

  getFileType(fileName: string){
    return fileName.split('.').pop();
  }

  // Toast messages
  
  displayToast() {
    this.toastr.success("message", "title");
  }
}
