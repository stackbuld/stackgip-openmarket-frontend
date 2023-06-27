import { MustMatch } from 'src/app/helpers/control-validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { IForgetPasswordModel } from 'src/app/models/auth-model';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  form: FormGroup = new FormGroup({});
  message = '';
  success = false;
  isSubmited = false;
  loading = false;
  email = '';
  token = '';
  constructor(private fb: FormBuilder, private router : Router,private route: ActivatedRoute,
              private authService: AuthService
    ) {

      this.form = fb.group({
        password: ['', [Validators.required]],
        confirm_password: ['', [Validators.required]]
      },
        {
        validator: MustMatch('password', 'confirm_password')
        });
   }

   get f() {
     return this.form.controls;
   }

   submit() {
     if(this.form.valid){
      if(this.email != null || this.token != null ){
        this.isSubmited = true;
        const password = this.form.get('password').value;
        const obj = {
          userId : this.email,
          token: this.token,
          password: password,
         } as IForgetPasswordModel;
        this.authService.ForgetPassword(obj).subscribe( a=> {
              this.message = "Success Your Password has been reset, Please Login";
              this.authService.Logout();
              if(a.status == 'success') { this.success = true; }
           }, err=> {
              this.success = false;
              this.message = 'Link must have expired and no longer valid, Resend a new link';
           });
        }
        else {
          this.success = false;
          this.message = 'Link must have expired and no longer valid, Resend a new link';
        }
     }
     else{
       this.message = "Please fill all required filled";
       this.success = false;

     }

   }

  ngOnInit(): void {

    this.email =   this.route.snapshot.queryParamMap.get('userId');
    this.token =   this.route.snapshot.queryParamMap.get('token');

  }


}
