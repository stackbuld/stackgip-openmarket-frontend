import { AppState } from "./reducers/index";
import { Component, OnInit } from "@angular/core";
import { Store, createSelector, createFeatureSelector } from "@ngrx/store";

import { Observable } from "rxjs";
import { increment, decrement, reset } from "./reducers/action/actions";

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

  constructor(private store: Store<AppState>) {
    console.log(this.count$);
  }

  ngOnInit(): void {
    this.count$ = this.store.select(getcount);
  }

  increment() {
    this.store.dispatch(increment());

    console.log("count obser", this.count$);
  }

  decrement() {
    this.store.dispatch(decrement());
  }

  reset() {
    this.store.dispatch(reset());
  }
}
