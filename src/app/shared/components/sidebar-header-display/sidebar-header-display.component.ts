import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { IUser } from 'src/app/models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { ProductSearchService } from 'src/app/services/seller/product-search.service';
import { SellerService } from 'src/app/services/seller/seller.service';

@Component({
  selector: 'app-sidebar-header-display',
  templateUrl: './sidebar-header-display.component.html',
  styleUrls: ['./sidebar-header-display.component.css'],
})
export class SidebarHeaderDisplayComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  currentRoute: string = 'seller/dashboard';
  userId: string;
  userProfilePicture: string;
  searchInput: FormControl;
  @ViewChild('search', { static: true }) searchQuery: ElementRef;
  isFetching: boolean = false;
  clearSearchInput$: Subscription;
  isTyping: boolean = false;
  profilePictureSub: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService,
    private sellerService: SellerService,
    private productSearchService: ProductSearchService
  ) {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? (this.currentRoute = event.url) : null;
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUser().id;

    if (this.authService.getLoggedInUser().profileImageUrl) {
      this.userProfilePicture =
        this.authService.getLoggedInUser().profileImageUrl;
    } else {
      this.userProfilePicture = localStorage.getItem('profilePicUrl')
        ? localStorage.getItem('profilePicUrl')
        : 'assets/image/default-profile-picture-3.png';
    }

    this.profilePictureSub = this.sellerService.newProfilePicture.subscribe(
      (value) => (this.userProfilePicture = value)
    );

    this.searchInput = new FormControl(null);

    this.searchInput.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.isTyping = true;
        this.productSearchService.isSearching.next(true);
      }
      if (value === '') {
        this.isTyping = false;
        this.productSearchService.isSearching.next(false);
      }
    });

    this.clearSearchInput$ =
      this.productSearchService.clearSearchInput.subscribe((status) => {
        if (status) {
          this.searchInput.reset();
          this.isTyping = false;
        }
      });
  }

  ngAfterViewInit(): void {
    this.getSearch();
  }

  getSearch() {
    fromEvent(this.searchQuery.nativeElement, 'keyup')
      .pipe(
        tap(() => {
          this.productSearchService.isFetching.next(true);
        }),
        filter(Boolean),
        debounceTime(300),
        distinctUntilChanged(),
        map((data) => this.searchQuery.nativeElement.value.toLowerCase()),
        switchMap((searchValue: any) => {
          return this.productSearchService.getProducts({
            userId: this.userId,
            search: searchValue,
          });
        })
      )
      .subscribe((res) => {
        this.productSearchService.searchResults.next(res);
        this.productSearchService.isFetching.next(false);
      });
  }

  onCloseSearch() {
    this.searchInput.reset();
    this.isTyping = false;
    this.productSearchService.isSearching.next(false);
  }

  ngOnDestroy(): void {
    if (this.clearSearchInput$) {
      this.clearSearchInput$.unsubscribe();
    }

    if (this.profilePictureSub) {
      this.profilePictureSub.unsubscribe();
    }
  }
}
