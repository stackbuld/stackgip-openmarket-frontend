import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { CreateProductResponse, DummyStore } from "../../../models/products.model";
import { ProductsService } from "../../../services/products/products.service";

@Component({
  selector: "app-seller-store",
  templateUrl: "./seller-store.component.html",
  styleUrls: ["./seller-store.component.css"],
})
export class SellerStoreComponent implements OnInit {
  @ViewChild('closeEdit') closeEdit: ElementRef<HTMLElement>;
  cproduct: CreateProductResponse[];
  dummyStores: DummyStore[] = [
    {
      id: 1,
      name: "Store Name",
      isDefaultStore: true,
      streetAddress: "No 12, Dapo Fafiade Street",
      city: "Shomolu, Lagos",
      country: "Nigeria",
      landmark: "Fifiade Bustop",
      postalCode: "104893",
      phoneNumber: "(234)8012345678",
      numberOfProductsInstore: 24,
    },
    {
      id: 2,
      name: "Store Name",
      isDefaultStore: false,
      streetAddress: "No 3, Tunji Akin Street",
      city: "Lekki, Lagos",
      country: "Nigeria",
      landmark: "Ikate Bustop",
      postalCode: "104823",
      phoneNumber: "(234)8012345678",
      numberOfProductsInstore: 12,
    },
    {
      id: 3,
      name: "Store Name",
      isDefaultStore: false,
      streetAddress: "No 3, Oba Arakunrin Street",
      city: "Surulere, Lagos",
      country: "Nigeria",
      landmark: "Surulere Stadium",
      postalCode: "101233",
      phoneNumber: "(234)8012345678",
      numberOfProductsInstore: 6,
    }
  ]


  constructor(private productservice: ProductsService) { }
  ngOnInit(): void { }


  cp(createproduct: CreateProductResponse): void {
    // this.productservice.createProduct(name).subscribe(cproduct => {
    //   this.cproduct.push(cproduct)
    // })
  }

  // closeAddProductModal(): void {
  //   this.closeCreate.nativeElement.click();
  // }

  closeEditProductModal(): void {
    this.closeEdit.nativeElement.click();
  }

  setAsDefault(index: number): void {
    this.dummyStores = this.dummyStores.map((store, i) => {
      return {
        ...store,
        isDefaultStore: index === i ? true : false
      }
    })
  }
}
