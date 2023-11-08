import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OwnerCreateComponent } from './owner/owner-create/owner-create.component';

@NgModule({
  declarations: [
    AppComponent,
    OwnerCreateComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
