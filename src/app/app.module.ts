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
import { InstantRunoffLearnComponent } from './instant-runoff-learn/instant-runoff-learn.component';
import { TopologicalLearnComponent } from './topological-learn/topological-learn.component';
import { KemenyLearnComponent } from './kemeny-learn/kemeny-learn.component';
import { KendallLearnComponent } from './kendall-learn/kendall-learn.component';
import { PluralityLearnComponent } from './plurality-learn/plurality-learn.component';
import { PopularLearnComponent } from './popular-learn/popular-learn.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { HighlightComponent } from './highlight/highlight.component';
import { ExternalLinkComponent } from './external-link/external-link.component';


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
    BordaLearnComponent,
    InstantRunoffLearnComponent,
    TopologicalLearnComponent,
    KemenyLearnComponent,
    KendallLearnComponent,
    PluralityLearnComponent,
    PopularLearnComponent,
    TutorialComponent,
    HighlightComponent,
    ExternalLinkComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'how-to-use', component: TutorialComponent },
      { path: 'kendall', component: KendallComponent},
      { path: 'borda/learn', component: BordaLearnComponent },
      { path: 'borda', component: BordaComponent },
      { path: 'topological/learn', component: TopologicalLearnComponent },
      { path: 'topological', component: TopologicalComponent },
      { path: 'plurality/learn', component: PluralityLearnComponent },
      { path: 'plurality', component: PluralityComponent },
      { path: 'kemeny/learn', component: KemenyLearnComponent },
      { path: 'kemeny', component: KemenyComponent },
      { path: 'popular/learn', component: PopularLearnComponent },
      { path: 'popular', component: PopularComponent },
      { path: 'instant-runoff/learn', component: InstantRunoffLearnComponent },
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
