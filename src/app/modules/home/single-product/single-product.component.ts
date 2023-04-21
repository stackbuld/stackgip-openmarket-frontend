import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit{
  currentImgUrl = '/assets/images/item1.png';
  activeImgId = 1;
  isInformation = true;
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
  imgUrls = [
    {
      id: 1,
      url: '/assets/images/item1.png'
    },
    {
      id: 2,
      url: '/assets/images/item2.png'
    },
    {
      id: 3,
      url: '/assets/images/item3.png'
    },
    {
      id: 4,
      url: '/assets/images/item4.png'
    }
  ]
  count = 1;
  productId = null;
  product = null;
  loading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.getParams();
  }

  getParams = () => {
    this.activatedRoute.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetails();
    });
  }

  getProductDetails = () => {
    this.loading = true;
    const productService$ = this.productService.getCachedProductById(this.productId);
    productService$.subscribe(res => {
      this.product = res.data;
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

  setImgUrl = (url: string, id: number) => {
    this.currentImgUrl = url;
    this.activeImgId = id;
  }

  increaseQuantity = () => {
    this.count++;
  }

  decreaseQuantity = () => {
    if(this.count > 1) {
      this.count--
    }
  }

  toggleModalView = () => {
    this.isInformation = !this.isInformation;
  }

  resetModalView = () => {
    this.isInformation = true;
  }
}
