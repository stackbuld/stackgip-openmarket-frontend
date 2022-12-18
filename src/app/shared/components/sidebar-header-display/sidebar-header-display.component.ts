import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-header-display',
  templateUrl: './sidebar-header-display.component.html',
  styleUrls: ['./sidebar-header-display.component.css']
})
export class SidebarHeaderDisplayComponent implements OnInit {
  currentRoute: string = 'seller/dashboard';
  constructor(
    private router: Router
  ) { 
    router.events.subscribe((event) => { event instanceof NavigationEnd ?
      this.currentRoute = event.url : null 
    });
  }


  ngOnInit(): void {
  }

}
