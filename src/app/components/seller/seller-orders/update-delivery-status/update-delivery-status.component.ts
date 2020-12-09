import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-delivery-status',
  templateUrl: './update-delivery-status.component.html',
  styleUrls: ['./update-delivery-status.component.css']
})
export class UpdateDeliveryStatusComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    
   }

  ngOnInit(): void {
    this.form = this.fb.group({
      status: ["", [Validators.required]]
    });
  }

  onSubmit():void{

  }
}
