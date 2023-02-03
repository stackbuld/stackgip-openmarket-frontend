import { WindowRefService } from "./../shared/services/window.service";
import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { AbstractControl } from "@angular/forms";

@Injectable({
  providedIn: "root",
})
export class ErrorService {
  window: Window;
  constructor(window: WindowRefService) {
    this.window = window.nativeWindow;
  }
  getClientErrorMessage(error: Error): string {
    return error.message ? error.message : error.toString();
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return this.window.navigator.onLine
      ? error.message
      : "No Internet Connection";
  }

  getControlError(controls): string[] {
    let errs: string[] = [];
    for (const name in controls) {
      if (controls[name].hasError("required")) {
        errs.push(name + ",");
      }
    }
    return this.makeErrorReadable(errs);
  }

  setControlEditError(controls: string[], absControl: AbstractControl) {
    let errs: string[] = [];
    controls.forEach((control) => {
      if (absControl.get(control.toLowerCase()).hasError("required")) {
        errs.push(control + ",");
      }
    });
    return this.makeErrorReadable(errs);
  }

  makeErrorReadable(errs: string[]) {
    const lastIndex: number = errs.length - 1;
    if (lastIndex > -1) {
      errs[lastIndex] = errs[lastIndex].replace(",", "");
      if (errs.length > 1) {
        errs[lastIndex - 1] = errs[lastIndex - 1].replace(",", "");
        errs[lastIndex] = "and " + errs[lastIndex];
      }
    }
    return errs;
  }
}
