import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buyer-header',
  templateUrl: './buyer-header.component.html',
  styleUrls: ['./buyer-header.component.scss'],
})
export class BuyerHeaderComponent implements OnInit {
  isShowSearch: boolean = false;
  isShowMenu: boolean = false;
  constructor() {}
  ngOnInit(): void {}
}
