import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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

    this.selectedBusinessState =
      localStorage.getItem('selectedBusinessState') || 'Select a state';
  }

  getStateValue() {
    localStorage.setItem('selectedBusinessState', this.selectedBusinessState);
  }
}
