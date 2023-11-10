import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule  } from '@angular/material/toolbar'
import { MatExpansionModule } from '@angular/material/expansion'

import { AppComponent } from './app.component';
import { OwnerCreateComponent } from './owner/owner-create/owner-create.component';
import { HeaderComponent } from './header/header.component';
import { OwnerListComponent } from './owner/owner-list/owner-list.component';
import { EmployeeCreateComponent } from './employee/employee-create/employee-create.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';

@NgModule({
  declarations: [
    AppComponent,
    OwnerCreateComponent,
    HeaderComponent,
    OwnerListComponent,
    EmployeeCreateComponent,
    EmployeeListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
