import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  currentSelection = "";


  constructor(private viewportScroller: ViewportScroller) { }

  public onClick(elementId: string): void {
    this.currentSelection = elementId;
    var myElement = document.getElementById(elementId);
    var topPos = myElement.offsetTop;
    document.getElementById('start-here').scrollTop = topPos;
  }
  ngOnInit(): void {
  }

}
