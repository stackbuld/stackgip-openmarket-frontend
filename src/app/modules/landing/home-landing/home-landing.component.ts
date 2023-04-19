import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: "app-home-landing",
  templateUrl: "./home-landing.component.html",
  styleUrls: ["./home-landing.component.scss"],
})
export class HomeLandingComponent implements AfterViewInit, OnInit {
  constructor(
    private http: HttpClient,
    private activeRoute: ActivatedRoute,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Renamarket best online platform to buy and sell securely with fast same day delivery' },
      {
        name: 'keywords', content: 'Rena market, Buy online, Sell online, Grow faster, Buy with crypto, E-commerce accepting Crypto, Fast delivery'
      }
    ]);
    this.setTitle('Renamarket - Fastest and most secured platform to buy and sell');
  }
  public setTitle(newTitle: string) {
    this.title.setTitle(newTitle);
  }
  @ViewChild('container') container: ElementRef<HTMLElement>;

  ngOnInit() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  
  }

  ngAfterViewInit(): void {

    this.activeRoute.params.subscribe(param => {
      console.log('param', param.pageSec)
      // alert(param.pageSec)
      if(param.pageSec){
        const section = this.container.nativeElement.querySelector(`#${param.pageSec}`)
        // console.log(section)

        section?.scrollIntoView()
      }
    })

  }
}
