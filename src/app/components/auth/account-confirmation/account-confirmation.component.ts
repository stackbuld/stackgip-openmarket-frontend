import { Component, OnInit } from "@angular/core";
import { ISignIn } from "src/app/models/signin-model";
import { AuthService } from "src/app/services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-account-confirmation",
  templateUrl: "./account-confirmation.component.html",
  styleUrls: ["./account-confirmation.component.css"],
})
export class AccountConfirmationComponent implements OnInit {
  message =
    "hello, you need to confirm your email address, please check mail box for confirmation link, thank you!";
  success = false;
  isSubmited = false;
  loading = false;
  userData: ISignIn;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userData = this.authService.GetSignInData();
  }

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get("userId");
    const token = this.route.snapshot.queryParamMap.get("token");
    if (email != null || token != null) {
      this.isSubmited = true;
      this.message = "Please wait we are verifing your account";
      console.log("confirm", email, token);
      this.authService.ConfirmEmail(email, token).subscribe(
        (a) => {
          this.message = "Success Your Account is confirmed, Please Login";
          this.authService.Logout();
          if (a.status == "success") {
            this.success = true;
          }
        },
        (err) => {
          this.success = false;
          this.message = "Link must have expired or invalid, Resend a new link";
        }
      );
    }
  }

  resendConfimation() {
    const email = this.userData.user.email;
    this.isSubmited = true;
    this.message = "sending you an email, please wait ";
    this.authService.SendConfirmationEmail(email).subscribe((a) => {
      this.success = true;

      console.log(a);
      if (a.status == "success") {
        this.message = "success: email confimation has been sent to " + email;
      } else {
        this.message = a.message;
      }
    });
  }

  logout() {
    this.authService.Logout();
    this.router.navigate(["/auth"]);
  }
}
