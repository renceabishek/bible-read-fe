import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { CommonService } from '../service/commonService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = 'bible'
  password = ''
  invalidLogin = false

  constructor(private router: Router,
    private loginservice: AuthenticationService, private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit() {
  }

  checkLogin() {
    if (this.loginservice.authenticate(this.username, this.password)
    ) {
      this.commonService.setIdentifyRouteComponent('login');
      this.router.navigate(['check'])
      //this.router.navigate([{ outlets: {primary: 'admin', adminbar: ['instructions'] } }]);
      //this.router.navigate([{ outlets: { primary: 'check', adminbar: ['instructions'] } }], {relativeTo: this.route});
      this.invalidLogin = false
    } else
      this.invalidLogin = true
  }

}
