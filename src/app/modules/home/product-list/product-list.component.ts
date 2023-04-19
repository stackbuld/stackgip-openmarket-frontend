import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  columnCount = 3;

  products = [
    {
      imgUrl: '/assets/images/item1.png',
      name: 'Polos',
      price: 7000
    },
    {
      imgUrl: '/assets/images/item2.png',
      name: 'Sweat Jacket',
      price: 216700
    },
    {
      imgUrl: '/assets/images/item3.png',
      name: 'Scarf Top',
      price: 35900
    },
    {
      imgUrl: '/assets/images/item4.png',
      name: 'Jean Trousers',
      price: 17000
    },
    {
      imgUrl: '/assets/images/item5.png',
      name: '2 Piece',
      price: 7000
    },
    {
      imgUrl: '/assets/images/item6.png',
      name: 'Cloth wardrobe',
      price: 24600
    },
    {
      imgUrl: '/assets/images/item7.png',
      name: `Baby's Outfit`,
      price: 2350
    },
  ]

  value: number = 700;
  highValue: number = 7590;
  options: Options = {
    floor: 0,
    ceil: 10000
  };

  distanceValue: number = 35;
  distanceHighValue: number = 110;
  distanceOptions: Options = {
    floor: 0,
    ceil: 200
  };

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

  }

  setColumn(e: any) {
    this.columnCount = Number(e.target.value);
  }

}
