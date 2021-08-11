import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.css"],
})
export class SliderComponent implements OnInit {
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      text: ["", [Validators.required]],
    });
  }
  get f() {
    return this.searchForm.controls;
  }
  search() {
    console.log("search : ", this.f.text.value);
    if (this.searchForm.valid) {
      location.href = "/products?search=" + this.f.text.value;
    }
  }
}
