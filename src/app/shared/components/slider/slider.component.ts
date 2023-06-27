import { WindowRefService } from '../../services/window.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css'],
})
export class SliderComponent implements OnInit {
  searchForm: FormGroup;
  window: Window;
  constructor(private fb: FormBuilder, windowRefService: WindowRefService) {
    this.window = windowRefService.nativeWindow;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      text: ['', [Validators.required]],
    });
  }
  get f() {
    return this.searchForm.controls;
  }
  search() {
    if (this.searchForm.valid) {
      this.window.location.href = '/products?search=' + this.f.text.value;
    }
  }
}
