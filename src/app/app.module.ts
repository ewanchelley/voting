import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { SortablejsModule } from 'ngx-sortablejs';

import { AppComponent } from './app.component';
import { KendallComponent } from './kendall/kendall.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [
    AppComponent,
    KendallComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {path: 'kendall', component: KendallComponent}
    ]),
    SortablejsModule.forRoot({ animation: 150}),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
