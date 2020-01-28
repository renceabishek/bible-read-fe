import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule,MatInputModule,MatAutocompleteModule } from  '@angular/material';
import { TotalcountComponent } from './totalcount/totalcount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PostComponent } from './post/post.component';
import { BibleInfoComponent } from './bible-info/bible-info.component';
import { ParticipantsComponent } from './participants/participants.component';
import { CustomizeComponent } from './customize/customize.component';

@NgModule({
  declarations: [
    AppComponent,
    TotalcountComponent,
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    PostComponent,
    BibleInfoComponent,
    ParticipantsComponent,
    CustomizeComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
