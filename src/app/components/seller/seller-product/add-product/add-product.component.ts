import { CreateShipmentModel } from "./../../../../models/products.model";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { nigeriaSates } from "src/app/data/nigeriastates";

declare var cloudinary: any;
@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"],
})
export class AddProductComponent implements OnInit {
  form: FormGroup;

  shipment: CreateShipmentModel[] = [];
  states: string[] = nigeriaSates.map((a) => a.name);
  constructor(private fb: FormBuilder) {}
  uploadWidget: any;

  get f() {
    return this.form.controls;
  }
  images = [];
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: [0.0, [Validators.required]],
      previousPrice: [0.0],
      category: ["", [Validators.required]],
      unit: [0, [Validators.required]],
    });
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          this.images.push(result.info.secure_url);
        }
      }
    );
    this.shipment.push({
      sn: 1,
      countryCode: "ng",
      state: "all",
      city: "all",
      cost: 0.0,
    });
  }

  upload() {
    this.uploadWidget.open();
  }

  addShipment() {
    const sn = Math.round(Math.random() * 99999);

    const createShipment = {
      sn: sn,
      countryCode: "ng",
      state: "all",
      city: "all",
      cost: 0.0,
    } as CreateShipmentModel;
    this.shipment.push(createShipment);
  }

  removeShipment(sn) {
    this.shipment = this.shipment.filter((a) => a.sn !== sn);
  }
}
