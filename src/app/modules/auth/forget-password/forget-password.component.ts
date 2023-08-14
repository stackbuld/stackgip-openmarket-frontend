import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { IForgetModel } from 'src/app/models/auth-model';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  isLoading: boolean;
  formGroup: FormGroup;
  message = '';
  success = false;
  isSubmited = false;
  
  get f() {
    return this.formGroup.controls; 
  }

  constructor(
    private fb: FormBuilder, 
    private authService : AuthService 
  ) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm = () => {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  sendEmail() {
    this.isSubmited = true;
    if(!this.formGroup.valid) {
      this.success = false;
      this.message = 'Please enter a valid email address';
      return;
    }
    const email = this.formGroup.get('email').value;
    const model = {
          email
        } as IForgetModel;
    this.isLoading = true;
    this.authService.SendForgetPassword(model).subscribe(res => {
      if(res) {
        this.success = true;
        this.isLoading = false;
        this.message = 'A password reset link has been sent to ' + this.formGroup.value.email;
        this.initForm();
      }
    }, err => {
      this.isLoading = false;
    });
  }
}
