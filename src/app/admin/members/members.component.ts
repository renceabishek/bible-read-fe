import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Participants } from '../../model/Participants';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-youthmembers',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class YouthMembersComponent implements OnInit {

  name = '';
  file = '';

  rowData: Participants[];
  columnDefs = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true }
  ];
  addParticipants: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private adminService: AdminService) { }

  ngOnInit() {
    this.addParticipants  = this.formBuilder.group({
      name: ['', Validators.required],
      file: ['', Validators.required]
    });

    this.adminService.getParticipantsInfo().subscribe(data => {
      this.rowData = data;
    })
  }

  get f() { return this.addParticipants.controls; }

  base64textString = [];

  changeListener(evt: any) {
    const file = evt.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  public onSubmit() {
      console.log('name '+this.addParticipants.value.file)
      console.log('file '+this.base64textString)
      this.adminService.postParticipantsInfo(this.addParticipants.value.name, this.base64textString[0]);
      //this.rowData.push()
  }

  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
  }
}
