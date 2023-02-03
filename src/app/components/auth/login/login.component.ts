import { Router } from "@angular/router";

import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from "@angular/forms";

import { Component, OnInit } from "@angular/core";

import { NgxUiLoaderService } from "ngx-ui-loader";
import { SignInModel } from "src/app/models/signin-model";
// import { UIkit } from "uikit";
import { AuthService } from "src/app/services/auth.service";
import { ToastrService } from "ngx-toastr";
// import {
//   FacebookLoginProvider,
//   GoogleLoginProvider,
//   SocialAuthService,
// } from "@abacritt/angularx-social-login";
import { of, Subscription } from "rxjs";
import { delay } from "rxjs/operators";
import { JwtHelperService } from "../../../services/jwt-helper.service";

// declare var gapi: any;

// facebook declarations
// declare var FB: any;
// declare var  statusChangeCallback: any;
// end of facebook decla
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  hasError = false;
  errors: any[] = [];
  errorMessage: string = "";
  loginForm: FormGroup;
  googleAuth: any;
  loading: false;
  message = "";
  tokenSubscription = new Subscription();
  decodedJwt;
  constructor(
    public authService: AuthService,
    // private socialAuthService: SocialAuthService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private jwtHelperService: JwtHelperService
  ) {}

  get f() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  login(): void {
    this.ngxService.startLoader("loader-01");
    this.authService.signIn(this.loginForm.value).subscribe(
      (res) => {
        if (res.status == "success") {
          if (res.data.canLogin) {
            this.ngxService.stopLoader("loader-01");
            this.authService.SetAuthLocalStorage(res);
            this.toast.success(res.message);
            this.router.navigate(["/seller/dashboard"]);
          } else {
            this.toast.error("Please confirm your email address");
            this.router.navigate(["/confirm-email"]);
          }
          // this.hasError = false;
          // if (!res.data.canLogin) {
          //   this.router.navigate(["/confirm-email"]);
          // } else {
          //   this.authService.logoutAndRedirectOnTokenExpiration(
          //     res.data.auth_token
          //   );
          //   this.router.navigate(["/"]);
          // }
        } else {
          this.ngxService.stopLoader("loader-01");
          // if (res.data.isNotAllowed) {
          //   this.router.navigate(["/confirm-email"]);
          // }
        }
      },
      (err) => {
        this.toast.error(err.error.message);
        this.ngxService.stopLoader("loader-01");
      }
    );
  }
}
