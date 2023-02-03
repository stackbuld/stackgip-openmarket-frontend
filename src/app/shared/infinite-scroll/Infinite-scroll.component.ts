import {
  OnInit,
  OnDestroy,
  ViewChild,
  Output,
  Input,
  ElementRef,
  EventEmitter,
  Component,
  AfterViewInit,
} from "@angular/core";
import { WindowRefService } from "../services/window.service";

@Component({
  selector: "infinite-scroll",
  // templateUrl: "./infinite-scroll.component.html",
  template: `<div #anchor><ng-content></ng-content></div>`,
  // template: `<ng-content></ng-content><div #anchor></div>`,
})
export class InfiniteScrollComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() options = {};
  @Output() scrolled = new EventEmitter();
  @ViewChild("anchor") anchor: ElementRef<HTMLElement>;

  private observer: IntersectionObserver;
  window: Window;
  constructor(private host: ElementRef, windowService: WindowRefService) {
    this.window = windowService.nativeWindow;
  }

  get element() {
    return this.host.nativeElement;
  }

  ngOnInit() {
    const options = {
      root: null,
      ...this.options,
    };

    this.observer = new IntersectionObserver(([entry]) => {
      entry.isIntersecting && this.scrolled.emit();
    }, options);

    // this.observer.observe(this.anchor.nativeElement);
  }

  ngAfterViewInit() {
    this.observer.observe(this.anchor.nativeElement);
  }

  private isHostScrollable() {
    const style = this.window.getComputedStyle(this.element);

    return (
      style.getPropertyValue("overflow") === "auto" ||
      style.getPropertyValue("overflow-y") === "scroll"
    );
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}
