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
      case 'normal-to':
        return 'assets/icons/moved-to-escrow.png';

      case 'normal-from':
        return 'assets/icons/moved-from-escrow.png';

      case 'withdrawal':
        return 'assets/icons/withdrawal.png';
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
      case 'normal-to':
        return 'rgba(19, 185, 5, 1)';

      case 'normal-from':
        return 'rgba(19, 185, 5, 1)';

      case 'withdrawal':
        return 'rgba(208, 23, 23, 1)';
    }
  }
}
