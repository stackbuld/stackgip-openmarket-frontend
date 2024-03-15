import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[transaction]',
  standalone: true,
})
export class TransactionDirective implements AfterViewInit {
  @Input() transaction!: string;

  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
    this.el.nativeElement.src = this.setSrc(this.transaction);
  }

  setSrc(type: string) {
    switch (type.toLowerCase()) {
      case 'normal-to':
        return 'assets/icons/moved-to-escrow.png';

      case 'normal-from':
        return 'assets/icons/moved-from-escrow.png';

      case 'withdrawal':
        return 'assets/icons/withdrawal.png';
    }
  }
}
