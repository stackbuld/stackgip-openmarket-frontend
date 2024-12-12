import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Directive({
  selector: '[renaClarityUnmask]'
})
export class ClarityUnmaskDirective implements OnInit, OnDestroy {
  private routerSubscription: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.applyClarityUnmask(this.el.nativeElement);
      });

    this.applyClarityUnmask(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private applyClarityUnmask(element: HTMLElement): void {
    const inputs = element.querySelectorAll('input');
    inputs.forEach((input) => {
      const type = input.getAttribute('type')?.toLowerCase();
      input.classList.add("input");
      if (type && !['password', 'ssn', 'credit-card'].includes(type)) {
        this.renderer.setAttribute(input, 'data-clarity-unmask', 'true');
      } else {
        this.renderer.removeAttribute(input, 'data-clarity-unmask');
      }
    });
  }
}
