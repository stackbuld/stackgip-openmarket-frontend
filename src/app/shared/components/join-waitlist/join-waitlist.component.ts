import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-join-waitlist",
  templateUrl: "./join-waitlist.component.html",
  styleUrls: ["./join-waitlist.component.css"],
})
export class JoinWaitlistComponent implements OnInit {
  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {}
}
