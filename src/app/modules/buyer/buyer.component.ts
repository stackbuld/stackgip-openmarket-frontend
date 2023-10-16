import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss'],
})
export class BuyerComponent implements OnInit {
  userId: string;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;
  }
}
