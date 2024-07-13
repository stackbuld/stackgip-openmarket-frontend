import { AppState } from './reducers/index';
import { Component, OnInit, Inject } from '@angular/core';
import { Store, createSelector, createFeatureSelector } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterState,
} from '@angular/router';

import { increment, decrement, reset } from './reducers/action/actions';
import { PwaService } from './services/pwa.service';
import { PwaPromptComponent } from './shared/components/pwa-prompt/pwa-prompt.component';
import { IUser } from './models/IUserModel';
import { datadogRum } from '@datadog/browser-rum';
import { PrimeNGConfig } from 'primeng/api';
import {AuthService} from './services/auth.service';

const selectCounter = (state: AppState) => state.count;

export const selectState = createFeatureSelector<AppState>('counterReducer');
export const getcount = createSelector(selectState, selectCounter);
declare var gtag: any;
declare let clarity;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Renamarket -Most Reliable and Secured Ecommerce Website';
  count$: Observable<number>;

  user!: IUser;

  constructor(
    private primengConfig: PrimeNGConfig,
    private store: Store<AppState>,
    private router: Router,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document,
    private pwaService: PwaService,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {
    this.handleRouteEvents();
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.count$ = this.store.select(getcount);

    this.pwaService.initPwaPrompt();


    if (!JSON.parse(localStorage.getItem('isPwaPromptCancelled'))) {
      this.pwaService.showModal.pipe(take(1)).subscribe((status) => {
        if (status) {
          this.dialog.open(PwaPromptComponent, { position: { top: '40px' } });
        }
      });
    }
    const signedInUser = this.authService.getLoggedInUser();
    this.user =  signedInUser;// JSON.parse(localStorage.getItem('user')!);
    if (this.user) {
      datadogRum.setUser({
        id: this.user.id,
        name: this.user.firstName + ' ' + this.user.lastName,
        email: this.user.email,
      });

  // microsoft clarity integration
  // @ts-ignore
  if (window.clarity && this.user) {
     clarity(
       'identify',
       this.user.id,
       this.user.email,
       this.user.phoneNumber,
       `${this.user.firstName} ${this.user.lastName}`
     );
    clarity('set', 'user_id', this.user.id);
    clarity('set', 'email', this.user.email);
    clarity('set', 'phone_number', this.user.phoneNumber);
    clarity('set', 'full_name', `${this.user.firstName} ${this.user.lastName}`);
  }
  }


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
