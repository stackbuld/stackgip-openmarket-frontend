import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavbarComponent } from "../navbar/navbar.component";
import { Meta,Title } from '@angular/platform-browser';

@Component({
  selector: "app-home-landing",
  templateUrl: "./home-landing.component.html",
  styleUrls: ["./home-landing.component.css"],
})
export class HomeLandingComponent implements AfterViewInit, OnInit {
  constructor(private http: HttpClient, private activeRoute: ActivatedRoute,private meta: Meta, private title: Title) {
    this.meta.addTags([
      {name: 'description', content: 'Rena market home landing page'},
      {name: 'keywords', content: 'Rena market, Buy online, Sell online, Grow faster'}
    ]);
    this.setTitle('Home landing Page');
  }
  public setTitle( newTitle: string) {
    this.title.setTitle( newTitle );
    }
  @ViewChild('container') container: ElementRef<HTMLElement>;

  ngOnInit() { }

  ngAfterViewInit(): void {

    this.activeRoute.params.subscribe(param => {
      if(param.pageSec){
        const section = this.container.nativeElement.querySelector(`#${param.pageSec}`)
        section?.scrollIntoView()
      }
    })
  }
}
