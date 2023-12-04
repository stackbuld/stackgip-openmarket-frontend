import { Directive, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[img-preloader]',
  host: {
    '[attr.src]': 'finalImage',
  },
})
export class ProductSearchImageDirective implements OnInit {
  @Input('img-preloader') targetSource: string;

  downloadingImage: any;
  finalImage: any;

  @Input() defaultImage: string = 'assets/image/image-placeholder.png';

  ngOnInit() {
    this.finalImage = this.defaultImage;

    this.downloadingImage = new Image();
    this.downloadingImage.onload = () => {
      this.finalImage = this.targetSource;
    };

    this.downloadingImage.src = this.targetSource;
  }
}
