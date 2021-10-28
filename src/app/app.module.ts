import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SortablejsModule } from 'ngx-sortablejs';

import { AppComponent } from './app.component';
import { BordaComponent } from './borda/borda.component';
import { KendallComponent } from './kendall/kendall.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RankingOffcanvasComponent } from './ranking-offcanvas/ranking-offcanvas.component';
import { AddRankingsComponent } from './add-rankings/add-rankings.component';
import { RankingsService } from './rankings.service';


@NgModule({
  declarations: [
    AppComponent,
    KendallComponent,
    NavbarComponent,
    RankingOffcanvasComponent,
    BordaComponent,
    AddRankingsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'kendall', component: KendallComponent},
      { path: 'borda', component: BordaComponent }
    ]),
    SortablejsModule.forRoot({ animation: 150}),
    FormsModule
  ],
  providers: [ RankingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
