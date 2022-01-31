import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SortablejsModule } from 'ngx-sortablejs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BordaComponent } from './borda/borda.component';
import { KendallComponent } from './kendall/kendall.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RankingOffcanvasComponent } from './ranking-offcanvas/ranking-offcanvas.component';
import { AddRankingsComponent } from './add-rankings/add-rankings.component';
import { RankingsService } from './rankings.service';
import { TopologicalComponent } from './topological/topological.component';
import { AlgComponent } from './alg/alg.component';
import { PluralityComponent } from './plurality/plurality.component';
import { KemenyComponent } from './kemeny/kemeny.component';
import { PopularComponent } from './popular/popular.component';
import { RankingComponent } from './ranking/ranking.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TileComponent } from './tile/tile.component';
import { InstantRunoffComponent } from './instant-runoff/instant-runoff.component';
import { ToastrModule } from 'ngx-toastr';
import { BordaLearnComponent } from './borda-learn/borda-learn.component';


@NgModule({
  declarations: [
    AppComponent,
    KendallComponent,
    NavbarComponent,
    RankingOffcanvasComponent,
    BordaComponent,
    AddRankingsComponent,
    TopologicalComponent,
    AlgComponent,
    PluralityComponent,
    KemenyComponent,
    PopularComponent,
    RankingComponent,
    SidebarComponent,
    TileComponent,
    InstantRunoffComponent,
    BordaLearnComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'kendall', component: KendallComponent},
      { path: 'borda/learn', component: BordaLearnComponent },
      { path: 'borda', component: BordaComponent },
      { path: 'topological', component: TopologicalComponent },
      { path: 'plurality', component: PluralityComponent },
      { path: 'kemeny', component: KemenyComponent },
      { path: 'popular', component: PopularComponent },
      { path: 'instant-runoff', component: InstantRunoffComponent },
    ]),
    SortablejsModule.forRoot({ animation: 150}),
    FormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true
    }),
    BrowserAnimationsModule
  ],
  providers: [ RankingsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
