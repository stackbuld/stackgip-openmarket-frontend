import { Injectable } from "@angular/core";
import { ToastrService as Toastr } from "ngx-toastr";

export const toastOptions = {
  positionClass: "toast-bottom-full-width",
  preventDuplicates: false,
};

@Injectable({
  providedIn: "root",
})
export class ToastrService {
  constructor(private toastr: Toastr) {}

  success(message: string, title = "") {
    this.toastr.success(message, title);
  }
  info(message: string, title = "") {
    this.toastr.info(message, title);
  }
  error(message: string, title = "") {
    this.toastr.error(message, title);
  }
  warining(message: string, title = "") {
    this.toastr.warning(message, title);
  }
}
