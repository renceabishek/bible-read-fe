import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule,MatInputModule,MatAutocompleteModule,MatSnackBarModule, MatTableModule,MatPaginatorModule  } from  '@angular/material';
import { MatMenuModule} from '@angular/material/menu';
import { TotalcountComponent } from './totalcount/totalcount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PostComponent } from './post/post.component';
import { BibleInfoComponent } from './bible-info/bible-info.component';
import { ParticipantsComponent } from './participants/participants.component';
import { CustomizeComponent } from './customize/customize.component';
import { MembersComponent } from './members/members.component';
import { BiblereadersComponent } from './biblereaders/biblereaders.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { AgGridModule } from 'ag-grid-angular';
import { DatatableComponent } from './bible-info/datatable/datatable.component';

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
    CustomizeComponent,
    MembersComponent,
    BiblereadersComponent,
    CarouselComponent,
    DatatableComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([]),
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
