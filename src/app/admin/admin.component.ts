import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../service/commonService';

@Component({
  selector: 'app-post',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, private loginService:AuthenticationService,
    private domSanitizer: DomSanitizer, private commonService: CommonService) { 
    this.addMobileViewIcons()
  }

  ngOnInit() {
    //this.commonService.modifyMenuActive('instructions');
  }

  addMobileViewIcons(): void {
    this.matIconRegistry.addSvgIcon(
      `instruction`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/admin/instruction.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `members`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/admin/members.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `bible`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/admin/bible.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `meeting`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/admin/meeting.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `logout`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/admin/logout.svg")
    );
  }

}
