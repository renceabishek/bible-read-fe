import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Profile } from '../model/Profile';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  partcipiants: Profile[];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getProfiles().subscribe(data=>{
     //let modelpartcipiants: Participants[];
   //  modelpartcipiants=data;
    // modelpartcipiants.forEach(f=>f.file=atob(f.file))
     
    //  this.partcipiants=modelpartcipiants;
    });
  }

}
