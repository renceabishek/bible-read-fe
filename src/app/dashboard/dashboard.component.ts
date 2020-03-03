import { Component, OnInit, ElementRef, HostListener, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public el: ElementRef, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
  }

  onAppear(): void {
    console.log('check '+this.document.body.scrollHeight)
    // if(this.document.body.scrollHeight>700) {
    //   console.log('getting inside')
      this.document.getElementById("text_div").classList.add("animation_organizer");
    // }    else {
    //   this.document.getElementById("text_div").classList.remove("animation_organizer");
    // }
  }

}
