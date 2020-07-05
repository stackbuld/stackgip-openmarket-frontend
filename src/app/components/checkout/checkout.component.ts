import { async } from "@angular/core/testing";
import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ProductCartModel } from "src/app/models/products.model";
import { getCart } from "src/app/reducers/selectors/cart.selector";
import { Store } from "@ngrx/store";
import { AppState } from "src/app/reducers";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "src/app/helpers/control-validators";
import { IUser } from "src/app/models/IUserModel";
import { getUser } from "src/app/reducers/selectors/auth.selector";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { environment } from "src/environments/environment";

declare var PaystackPop: any;
@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  constructor(private store: Store<AppState>, private fb: FormBuilder) {}
  user$: Observable<IUser>;
  carts$: Observable<ProductCartModel[]>;
  cartTotal: number;
  states: string[];
  checkoutForm: FormGroup;

  ngOnInit(): void {
    this.carts$ = this.store.select(getCart);
    this.user$ = this.store.select(getUser);
    this.carts$.subscribe((items) => {
      let total = 0;
      for (const item of items) {
        total += item.price * item.orderedUnit;
      }
      this.cartTotal = total;
    });
    this.initlizeForm();
    this.states = nigeriaSates.map((a) => a.name);
  }

  get f() {
    return this.checkoutForm.controls;
  }
  initlizeForm() {
    const user = localStorage.getItem("user");
    if (user) {
      const userJson: IUser = JSON.parse(user);
      this.checkoutForm = this.fb.group({
        firstname: [userJson.firstName, [Validators.required]],
        lastname: [userJson.lastName, [Validators.required]],
        email: [userJson.email, [Validators.required, Validators.email]],
        phoneNumber: [userJson.phoneNumber, [Validators.required]],
        address: [userJson.address, [Validators.required]],
        country: [userJson.alpha2CountryCode, [Validators.required]],
        state: [userJson.state, [Validators.required]],
        city: ["", [Validators.required]],
        additionalInfo: "",
      });
    } else {
      this.checkoutForm = this.fb.group({
        firstname: ["", [Validators.required]],
        lastname: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        phoneNumber: ["", [Validators.required]],
        address: ["", [Validators.required]],
        country: ["", [Validators.required]],
        state: ["", [Validators.required]],
        city: ["", [Validators.required]],
        additionalInfo: "",
      });
    }
  }

  checkout() {
    if (!this.checkoutForm.valid) {
      return;
    }
    this.payWithPaystack();
  }

  payWithPaystack() {
    let handler = PaystackPop.setup({
      key: environment.paystackPublicKey, // Replace with your public key
      email: this.checkoutForm.get("email").value,
      amount: 1000 * 100,
      firstname: this.checkoutForm.get("firstname").value,
      lastname: this.checkoutForm.get("lastname").value,
      phone: this.checkoutForm.get("phoneNumber").value,
      ref: "" + Math.floor(Math.random() * 1000000000 + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function () {
        alert("Window closed.");
      },
      callback: function (response) {
        let message = "Payment complete! Reference: " + response.reference;
        alert(message);
      },
    });
    handler.openIframe();
  }
}
