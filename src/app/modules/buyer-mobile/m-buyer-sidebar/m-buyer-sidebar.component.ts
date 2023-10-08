import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-m-buyer-sidebar',
  templateUrl: './m-buyer-sidebar.component.html',
  styleUrls: ['./m-buyer-sidebar.component.scss'],
})
export class MBuyerSidebarComponent implements OnInit {
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
