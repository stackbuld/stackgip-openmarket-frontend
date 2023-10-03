import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buyer-sidebar',
  templateUrl: './buyer-sidebar.component.html',
  styleUrls: ['./buyer-sidebar.component.scss'],
})
export class BuyerSidebarComponent implements OnInit {
  isPersonalOpened: boolean = true;
  isSettingsOpened: boolean = true;
  constructor() {}

  ngOnInit(): void {}

  onTogglePersonal(type: string) {
    if (type == 'information') {
      this.isPersonalOpened = !this.isPersonalOpened;
    }
    if (type == 'settings') {
      this.isSettingsOpened = !this.isSettingsOpened;
    }
  }
}
