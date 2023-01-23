import { Category } from './../../../../models/products.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit {
  loading = false;
  previewData = {
    name: 'Hp Pavilion 15 11th 500GB Win 10 + 1 Year Warranty',
    price: 23000,
    description: `
    Screen-to-body ratio (without speakers) - 81.2% 3\
    Color gamut - 45% NTSC
    Brightness - 220 nits
    Minimum dimensions (W x D x H) - 35.85 x 24.2 x 1.99 cm (Dimensions vary by configuration)
    Weight - Starting at 1.78 kg (Weight varies by configuration)
    Software - Productivity & finance
    Software included - McAfee LiveSafe™
    Cloud service - 25 GB Dropbox storage for 12 months 5
    `,
    Category: 'Computer',
    unit_available: 9,
    unit_sold: 2,
    unit: 23,
    variations: [
      {
        title: 'Color',
        value: 'Green'
      },
      {
        title: 'size',
        value: 43
      }
    ],
    imageUrls: [
      "https://res.cloudinary.com/dimxqjzpr/image/upload/v1674392449/openmarket/shg25zq4safchpwmpcln.png",
      "https://res.cloudinary.com/dimxqjzpr/image/upload/v1674392462/openmarket/xomjtch09qr6mjwbpdxl.png",
      "https://res.cloudinary.com/dimxqjzpr/image/upload/v1674392453/openmarket/liz6s9uvknkpoz4hvumm.png"
    ]
  }
  previewImg: string;

  constructor() { }

  ngOnInit(): void {
    this.previewImg = this.previewData.imageUrls[0];
  }

  showImg(img: string) {
    this.previewImg = img;
  }

  changeUnit = (unit: any, type: string) => {
    let it = parseInt(unit)
    if(type === 'add') {
      // this.form.patchValue({'unit': it + 1});
      this.previewData.unit = it + 1;
    }
    if(type === 'minus') {
      if(it > 1) {
        // this.form.patchValue({'unit': it - 1});
        this.previewData.unit = it - 1;
      }
    }
  }

}
