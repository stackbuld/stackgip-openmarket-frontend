import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { IForgetModel } from 'src/app/models/auth-model';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {


formGroup: FormGroup;
message = '';
success = false;
isSubmited = false;
get f() {return this.formGroup.controls; }
  constructor(private fb: FormBuilder, private authService : AuthService ) {  }


  ngOnInit(): void {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendEmail() {
    this.isSubmited = true;
    if(!this.formGroup.valid) {
      this.success = false;
      this.message = 'please enter a valid email address';
      return;
    }
    const email = this.formGroup.get('email').value;
    const model = {
          email
        } as IForgetModel;
    this.authService.SendForgetPassword(model)
        .subscribe( a=> {
          this.success = true;
          this.message = 'password reset link has been sent to ' + email;
        });
  }
}
