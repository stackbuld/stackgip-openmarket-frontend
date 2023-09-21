import { Component, OnInit } from '@angular/core';
import { log } from 'console';

import { nigeriaSates } from 'src/app/data/nigeriastates';

@Component({
  selector: 'app-business-profile',
  templateUrl: './business-profile.component.html',
  styleUrls: ['./business-profile.component.scss'],
})
export class BusinessProfileComponent implements OnInit {
  states: string[] = [];
  selectedBusinessState!: string;

  constructor() {}

  ngOnInit(): void {
    this.states = nigeriaSates.map((a) => a.name);
    this.states.unshift('Select a state');

    this.selectedBusinessState = localStorage.getItem('selectedBusinessState')!;
  }

  getStateValue() {
    localStorage.setItem('selectedBusinessState', this.selectedBusinessState);
  }
}
