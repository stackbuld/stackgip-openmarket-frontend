import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: "app-home-landing",
  templateUrl: "./home-landing.component.html",
  styleUrls: ["./home-landing.component.css"],
})
export class HomeLandingComponent implements AfterViewInit {
  constructor(private http: HttpClient, private activeRoute: ActivatedRoute,) {}
  @ViewChild('container') container: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {

    this.activeRoute.params.subscribe(param => {
      if(param.pageSec){
        const section = this.container.nativeElement.querySelector(`#${param.pageSec}`)
        section?.scrollIntoView()
      }
    })
  }
}
