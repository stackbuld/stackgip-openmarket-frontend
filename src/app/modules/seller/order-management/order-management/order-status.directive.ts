import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appOrderStatusDirective]',
})
export class OrderStatusDirective implements OnInit {
  @Input('appOrderStatusDirective') appOrderStatusDirective: string;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setStatusColor(this.appOrderStatusDirective);
  }

  setStatusColor(status: string) {
    let color = '';

    switch (status.toLowerCase()) {
      case 'confirmed':
        color = '#4CAF50';
        break;
      case 'pending' || 'notset':
        color = '#F9AA4B';
        break;
      case 'rejected' || 'cancelled' || 'returned':
        color = '#EF0606';
        break;
      default:
        color = '#F9AA4B';
    }

    this.renderer.setAttribute(this.elementRef.nativeElement, 'fill', color);
  }
}
