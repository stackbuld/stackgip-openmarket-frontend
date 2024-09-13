import { MustMatch } from 'src/app/helpers/control-validators';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IForgetPasswordModel } from 'src/app/models/auth-model';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  passWordType = 'password';
  passwordImgUrl = '/assets/icons/eye-block.png';
  passWordType2 = 'password';
  passwordImgUrl2 = '/assets/icons/eye-block.png';
  isLoading: boolean;
  document: Document = inject(DOCUMENT);

  form: FormGroup = new FormGroup({});
  message = '';
  success = false;
  isSubmited = false;
  loading = false;
  email = '';
  token = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap
      .get('userId')
      .replace(/ /g, '+');
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  initForm = () => {
    this.form = this.fb.group(
      {
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]],
      },
      {
        validator: MustMatch('password', 'confirm_password'),
      }
    );
  };

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.valid) {
      if (this.email != null || this.token != null) {
        this.isSubmited = false;
        this.isLoading = true;
        const password = this.form.get('password').value;
        const obj = {
          userId: this.email,
          token: this.token,
          password: password,
        } as IForgetPasswordModel;
        this.authService.ForgetPassword(obj).subscribe(
          (a) => {
            this.isSubmited = true;
            this.message = 'Success Your Password has been reset, Please Login';
            this.authService.Logout();
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
              this.toast.success(
                'Success Your Password has been reset, Please Login',
                'Password Reset'
              );
            }, 2000);
            this.isLoading = false;
            // this.initForm();
            if (a.status == 'success') {
              this.success = true;
            }
          },
          (err) => {
            this.isLoading = false;
            this.isSubmited = true;
            this.success = false;
            this.message =
              'Link must have expired and no longer valid, Resend a new link';
          }
        );
      } else {
        this.isSubmited = true;
        this.success = false;
        this.message =
          'Link must have expired and no longer valid, Resend a new link';
      }
    } else {
      this.message = 'Please fill all required filled';
      this.success = false;
    }
  }

  togglePassword = () => {
    if (this.passWordType === 'password') {
      this.passWordType = 'text';
      this.passwordImgUrl = '/assets/icons/eye-open.png';
    } else if (this.passWordType === 'text') {
      this.passWordType = 'password';
      this.passwordImgUrl = '/assets/icons/eye-block.png';
    }
  };

  togglePassword2 = () => {
    if (this.passWordType2 === 'password') {
      this.passWordType2 = 'text';
      this.passwordImgUrl2 = '/assets/icons/eye-open.png';
    } else if (this.passWordType2 === 'text') {
      this.passWordType2 = 'password';
      this.passwordImgUrl2 = '/assets/icons/eye-block.png';
    }
  };
}
