import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

    constructor(@Inject(DOCUMENT) private document: Document) {
        
    }

    public modifyMenuActive(navlink): void {
        if(navlink=='bibleInfo') {
            this.document.getElementById("ccy-li-instruction").classList.remove("active");
            this.document.getElementById("ccy-li-membersinfo").classList.remove("active");
            this.document.getElementById("ccy-li-bibleinfo").classList.add("active");
            this.document.getElementById("ccy-li-meetings").classList.remove("active");
            this.document.getElementById("ccy-li-login").classList.remove("active");
            this.document.getElementById("ccy-li-logout").classList.remove("active");

        } else if(navlink=='instructions') {
            this.document.getElementById("ccy-li-instruction").classList.add("active");
            this.document.getElementById("ccy-li-membersinfo").classList.remove("active");
            this.document.getElementById("ccy-li-bibleinfo").classList.remove("active");
            this.document.getElementById("ccy-li-meetings").classList.remove("active");
            this.document.getElementById("ccy-li-login").classList.remove("active");
            this.document.getElementById("ccy-li-logout").classList.remove("active");
        }
    }
}