import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule,MatInputModule,MatAutocompleteModule,MatSnackBarModule, MatTableModule,MatPaginatorModule,MatDialogModule,MatDatepickerModule,MatNativeDateModule, MatButtonToggleModule, MatCheckboxModule  } from  '@angular/material';
import { MatMenuModule} from '@angular/material/menu';
import { TotalcountComponent } from './totalcount/totalcount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AdminComponent } from './admin/admin.component';
import { BibleInfoComponent } from './admin/bible-info/bible-info.component';
import { ParticipantsComponent } from './participants/participants.component';
import { YouthMembersComponent } from './admin/members/members.component';
import { MembersComponent } from './members/members.component';
import { BiblereadersComponent } from './biblereaders/biblereaders.component';
import { CarouselComponent } from './carousel/carousel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { AgGridModule } from 'ag-grid-angular';
import { DatatableComponent } from './admin/bible-info/datatable/datatable.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InstructionsComponent } from './admin/instructions/instructions.component';
import { YouthmeetingsComponent } from './admin/youthmeetings/youthmeetings.component';
import { AutoCompleteDialogComponent }  from './admin/auto-complete-dialog/auto-complete-dialog.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { SkillBoxComponent } from './admin/dialog/skill-box/skill-box.component';

@NgModule({
  declarations: [
    AppComponent,
    TotalcountComponent,
    DashboardComponent,
    LoginComponent,
    LogoutComponent,
    AdminComponent,
    BibleInfoComponent,
    ParticipantsComponent,
    YouthMembersComponent,
    MembersComponent,
    BiblereadersComponent,
    CarouselComponent,
    DatatableComponent,
    InstructionsComponent,
    YouthmeetingsComponent,
    AutoCompleteDialogComponent,
    SkillBoxComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule.withComponents([]),
    LottieAnimationViewModule.forRoot(),
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
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatDialogModule
  ],
  entryComponents: [AutoCompleteDialogComponent, SkillBoxComponent],
  providers: [ MatDatepickerModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
