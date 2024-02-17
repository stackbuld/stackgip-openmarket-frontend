import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  @Input() borderStyle!: string;
  @Input() size!: string;

  get additionalStyles() {
    return {
      border: this.borderStyle,
      'border-bottom-color': 'transparent',
      width: this.size,
      height: this.size,
    };
  }
}
