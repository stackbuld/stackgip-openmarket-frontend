import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[transaction]',
  standalone: true,
})
export class TransactionDirective implements AfterViewInit {
  @Input() transaction!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
  ngAfterViewInit() {
    this.renderer.setAttribute(
      this.el.nativeElement,
      'src',
      this.setSrc(this.transaction),
    );
  }

  setSrc(type: string) {
    switch (type.toLowerCase()) {
      case 'credit':
        return 'assets/icons/moved-to-escrow.svg';

      case 'test':
        return 'assets/icons/moved-from-escrow.svg';

      case 'debit':
        return 'assets/icons/withdrawal.svg';
    }
  }
}

@Directive({
  selector: '[transactionAmount]',
  standalone: true,
})
export class TransactionAmount implements AfterViewInit {
  @Input() transactionAmount!: string;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}
  ngAfterViewInit() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'color',
      this.setColor(this.transactionAmount),
    );
  }

  setColor(type: string) {
    switch (type.toLowerCase()) {
      case 'credit':
        return 'rgba(19, 185, 5, 1)';

      case 'normal-from':
        return 'rgba(19, 185, 5, 1)';

      case 'debit':
        return 'rgba(208, 23, 23, 1)';
    }
  }
}
