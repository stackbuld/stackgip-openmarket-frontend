import {
  ProductWithOptionAndShipmentModel,
  CreateProductOption,
} from "./../../models/products.model";
import { ProductsService } from "src/app/services/products/products.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { formatDate } from "./../../helpers/date-format";
import { numberWithCommas } from "./../../helpers/number-format";
import { debounceTime } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-to-cart",
  templateUrl: "./add-to-cart.component.html",
  styleUrls: ["./add-to-cart.component.css"],
})
export class AddToCartComponent implements OnInit {
  @Input() productId: number;
  @Output() addedToCart = new EventEmitter();
  @Output() closed = new EventEmitter();
  productOptions: { [title: string]: CreateProductOption[] };
  selectedProductOptions: { [title: string]: string } = {};
  product: ProductWithOptionAndShipmentModel = null;
  currentOptions: { [title: string]: number } = {};
  numberWithCommas: Function;
  priceWithOptions: number;
  currentQuantity: number;
  optionForm: FormGroup;
  formatDate: Function;
  totalPrice: number;
  availablePaymentOption = [];

  constructor(
    private productService: ProductsService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {
    this.numberWithCommas = numberWithCommas;
    this.formatDate = formatDate;
  }

  ngOnInit(): void {
    this.productService
      .getProductById(this.productId.toString())
      .subscribe((a) => {
        this.product = a.data as unknown as ProductWithOptionAndShipmentModel;
        this.init();
      });
    this.optionForm = this.fb.group({
      shipmentOption: ["", [Validators.required]],
      quantity: [1, [Validators.required]],
      options: this.fb.array([]),
      paymentOption: ["", [Validators.required]],
    });
    this.optionForm
      .get("quantity")
      .valueChanges.pipe(debounceTime(200))
      .subscribe((data) => this.onQuantityValueChanged(data));
    this.currentQuantity = 1;
  }

  init(): void {
    this.productOptions = this.groupBy("title");
    this.totalPrice = this.product.price;
    this.priceWithOptions = this.product.price;
    const defaultShipment: string = this.getDefaultShipment();
    this.optionForm.get("shipmentOption").setValue(defaultShipment);
    this.setOptionForm(Object.keys(this.productOptions));

    this.availablePaymentOption = this.product.paymentOptions
      ? this.product.paymentOptions.split(",")
      : [];
    this.optionForm
      .get("paymentOption")
      .setValue(this.availablePaymentOption[0]);
  }

  optionArray(): FormArray {
    return this.optionForm.get("options") as FormArray;
  }

  setOptionForm(options: string[]): void {
    options.forEach((option) => {
      let { title, value, cost } = this.productOptions[option][0];
      let itemToAdd = this.fb.group({
        title: option,
        cost: [`${cost}|${value}`, []],
      });
      itemToAdd.valueChanges
        .pipe(debounceTime(200))
        .subscribe((data) =>
          this.onOptionValueChanged({ cost: data.cost, title: data.title })
        );
      this.optionArray().push(itemToAdd);
      this.currentOptions[option] = 0;
      cost = String(cost);
      this.onOptionValueChanged({ title, cost });
    });
  }

  onQuantityValueChanged(qty: number) {
    this.currentQuantity = qty;
    this.totalPrice = this.priceWithOptions * this.currentQuantity;
  }

  onOptionValueChanged(data: { title: string; cost: string }) {
    const [cost, value] = data.cost.split("|");
    const numCost = Number(cost);
    this.priceWithOptions -= this.currentOptions[data.title];
    this.priceWithOptions += numCost;
    this.currentOptions[data.title] = numCost;
    this.totalPrice =
      Number(this.priceWithOptions) * Number(this.currentQuantity);
    this.selectedProductOptions[data.title] = value;
  }

  addToCart() {
    const paymentOption = this.optionForm.get("paymentOption");
    const shipmentOption = this.optionForm.get("shipmentOption");
    let currentShipmentOption: string = "state|city|0";
    if (this.product.productShipments.length > 0) {
      currentShipmentOption = shipmentOption.value;
    }
    if (this.optionForm.get("quantity").value < 1) {
      this.toast.error("please enter a valid quantity");
      return;
    }
    const [state, city, cost] = currentShipmentOption.split("|");
    this.moveProductToCart({
      shipmentOption: JSON.stringify({ state, city, cost }),
      paymentOption: paymentOption.value,
      productOptions: JSON.stringify(this.selectedProductOptions),
    });
  }

  moveProductToCart(cartOption) {
    this.product.price = this.priceWithOptions;
    this.addedToCart.emit({
      product: this.product,
      orderedUnit: this.currentQuantity,
      paymentOption: cartOption.paymentOption,
      shipmentOption: cartOption.shipmentOption,
      productOptions: cartOption.productOptions,
    });
  }

  groupBy(property: string): { [title: string]: CreateProductOption[] } {
    return this.product.productOptions.reduce((acc, obj) => {
      const key = obj[property];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);
      return acc;
    }, {});
  }

  close() {
    this.closed.emit();
  }

  getDefaultShipment() {
    let shipmentOptionDefault: string = "";
    if (this.product.productShipments.length > 0) {
      shipmentOptionDefault =
        this.product.productShipments[0].state +
        "|" +
        this.product.productShipments[0].city +
        "|" +
        this.product.productShipments[0].cost;
    }
    return shipmentOptionDefault;
  }
}
