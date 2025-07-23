import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISignIn } from '../../../models/signin-model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-account-confirmation',
    templateUrl: './account-confirmation.component.html',
    styleUrls: ['./account-confirmation.component.css'],
    standalone: false
})
export class AccountConfirmationComponent implements OnInit {
  message =
    'hello, you need to confirm your email address, please check mail box for confirmation link, thank you!';
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
    const userIdParam = this.route.snapshot.queryParamMap.get('userId');
    const email = userIdParam ? userIdParam.replace(/ /g, '+') : null;
    const token = this.route.snapshot.queryParamMap.get('token');
    if (email !== null && token !== null) {
      this.isSubmited = true;
      this.message = 'Please wait we are verifing your account';
      this.authService.ConfirmEmail(email, token).subscribe(
        (a) => {
          this.message = 'Success Your Account is confirmed, Please Login';
          this.authService.Logout();
          if (a.status == 'success') {
            this.success = true;
          }
        },
        (err) => {
          this.success = false;
          this.message = 'Link must have expired or invalid, Resend a new link';
        }
      );
    } else {
      this.message = 'Invalid confirmation link. Please check your email or request a new link.';
      this.success = false;
    }
  }

  resendConfimation() {
    const email = this.userData.user.email;
    this.isSubmited = true;
    this.message = 'sending you an email, please wait ';
    this.authService.SendConfirmationEmail(email).subscribe((a) => {
      this.success = true;
      if (a.status == 'success') {
        this.message = 'success: email confimation has been sent to ' + email;
      } else {
        this.message = a.message;
      }
    });
  }

  logout() {
    this.authService.Logout();
    this.router.navigate(['/auth']);
  }
}
