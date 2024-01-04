import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDeliveryStatus]',
})
export class DeliveryStatusDirective implements OnInit {
  @Input('appDeliveryStatus') status: string;
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setBackgroundColor(this.status);
  }

  setBackgroundColor(status: string) {
    let color = '';

    switch (status.toLowerCase()) {
      case 'delivered':
        color = '#4CAF50';
        break;
      case 'pending' || 'notset':
        color = '#F9AA4B';
        break;
      case 'rejected' || 'cancelled' || 'returned':
        color = '#EF0606';
        break;
      case 'scheduled':
        color = '#0096FF';
        break;
      default:
        color = '#F9AA4B';
    }

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'backgroundColor',
      color
    );
  }
}
