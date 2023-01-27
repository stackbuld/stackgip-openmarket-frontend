import { AppState } from "./reducers/index";
import { Component, OnInit, Inject } from "@angular/core";
import { Store, createSelector, createFeatureSelector } from "@ngrx/store";

import { Observable } from "rxjs";
import { increment, decrement, reset } from "./reducers/action/actions";
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterState } from '@angular/router';

const selectCounter = (state: AppState) => state.count;

export const selectState = createFeatureSelector<AppState>("counterReducer");
export const getcount = createSelector(selectState, selectCounter);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "ecommerce-app";

  count$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
    ) {
      this.handleRouteEvents();
    console.log(this.count$);
  }

  handleRouteEvents() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(this.router.routerState, this.router.routerState.root).join('-');
        this.titleService.setTitle(title);
        gtag('event', 'page_view', {
          page_title: title,
          page_path: event.urlAfterRedirects,
          page_location: this.document.location.href
        })
      }
    });
  }

  getTitle(state: RouterState, parent: ActivatedRoute): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data['title']) {
      data.push(parent.snapshot.data['title']);
    }
    if (state && parent && parent.firstChild) {
      data.push(...this.getTitle(state, parent.firstChild));
    }
    return data;
  }

  ngOnInit(): void {
    this.count$ = this.store.select(getcount);
  }

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
}
