import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TotalcountComponent } from '../app/totalcount/totalcount.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuardService } from './service/auth-guard.service';
import { BibleInfoComponent } from './admin/bible-info/bible-info.component';
import { YouthMembersComponent } from './admin/members/members.component';
import { ParticipantsComponent } from './participants/participants.component';
import { MembersComponent } from './members/members.component';
import { BiblereadersComponent } from './biblereaders/biblereaders.component';
import { InstructionsComponent } from './admin/instructions/instructions.component';
import { YouthmeetingsComponent } from './admin/youthmeetings/youthmeetings.component';
import { ActivityComponent } from './admin/activity/activity.component';


const routes: Routes = [
  {path:'totalCounts', component: TotalcountComponent},
  {path:'members', component: MembersComponent},
  {path:'biblereaders', component: BiblereadersComponent},
  {path:'participants', component: ParticipantsComponent},
  {path:"check", component: AdminComponent,  canActivate:[AuthGuardService], children: [
    {path:'instructions', component: InstructionsComponent, canActivate:[AuthGuardService], outlet:"adminbar"},
    {path:'membersinfo', component: YouthMembersComponent, canActivate:[AuthGuardService], outlet:"adminbar"},
    {path:'bibleinfo', component: BibleInfoComponent, canActivate:[AuthGuardService], outlet:"adminbar"},
    {path:'meetings', component: YouthmeetingsComponent, canActivate:[AuthGuardService], outlet:"adminbar"},
    {path:'activity', component: ActivityComponent, canActivate:[AuthGuardService], outlet:"adminbar"}
  ]},
  {path:'login', component: LoginComponent},
  {path:'logout', component: LogoutComponent},
  {path: '', component: DashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
