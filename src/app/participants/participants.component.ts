import { Component, OnInit } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Participants } from '../model/Participants';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  partcipiants: Participants[];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getParticipantsInfo().subscribe(data=>{
     let modelpartcipiants: Participants[];
     modelpartcipiants=data;
    // modelpartcipiants.forEach(f=>f.file=atob(f.file))
     
      this.partcipiants=modelpartcipiants;
    });
  }

}
