import { AppState } from './reducers/index';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { increment, decrement, reset } from './reducers/action/actions';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterState,
} from '@angular/router';
import { PwaService } from './services/pwa.service';
import uikit from 'uikit';

const selectCounter = (state: AppState) => state.count;

export const selectState = createFeatureSelector<AppState>('counterReducer');
export const getcount = createSelector(selectState, selectCounter);
declare var gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ecommerce-app';

  count$: Observable<number>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private pwaService: PwaService
  ) {
    this.handleRouteEvents();
  }

  ngOnInit(): void {
    this.count$ = this.store.select(getcount);

    this.pwaService.initPwaPrompt();

    this.pwaService.showModal.pipe(take(1)).subscribe((status) => {
      if (status) {
        uikit.modal('#prompt-modal').show();
      }
    });
  }

  handleRouteEvents() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const title = this.getTitle(
          this.router.routerState,
          this.router.routerState.root
        ).join('-');
        this.titleService.setTitle(title);
        // gtag('event', 'page_view', {
        //   page_title: title,
        //   page_path: event.urlAfterRedirects,
        //   page_location: this.document.location.href,
        // });
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

  onPromptInstall() {
    this.pwaService.showInstallPrompt();
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
