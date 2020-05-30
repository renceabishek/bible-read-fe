import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../service/commonService';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry, public loginService:AuthenticationService,
    private domSanitizer: DomSanitizer, private commonService: CommonService, private router: Router,
    private route: ActivatedRoute) { 
    this.addMobileViewIcons()
  }

  ngOnInit() {
    if(this.commonService.getIdentifyRouteComponent()=='login') {
      this.router.navigate([{ outlets: { adminbar: ['instructions'] } }], {relativeTo: this.route});
    } else {
      this.commonService.setIdentifyRouteComponent('other')
    }
    
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
