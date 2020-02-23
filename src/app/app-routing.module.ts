import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TotalcountComponent } from '../app/totalcount/totalcount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostComponent } from './post/post.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuardService } from './service/auth-guard.service';
import { BibleInfoComponent } from './bible-info/bible-info.component';
import { CustomizeComponent } from './customize/customize.component';
import { ParticipantsComponent } from './participants/participants.component';
import { MembersComponent } from './members/members.component';
import { BiblereadersComponent } from './biblereaders/biblereaders.component';


const routes: Routes = [
  {path:'totalCounts', component: TotalcountComponent},
  {path:'members', component: MembersComponent},
  {path:'biblereaders', component: BiblereadersComponent},
  {path:'participants', component: ParticipantsComponent},
  {path:'viewBibleInfo', component: BibleInfoComponent},
  {path:'customize', component: CustomizeComponent},
  {path:'post', component: PostComponent,canActivate:[AuthGuardService]},
  {path:'login', component: LoginComponent},
  {path:'logout', component: LogoutComponent,canActivate:[AuthGuardService]},
  {path: '', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
