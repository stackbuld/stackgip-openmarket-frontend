import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_SELECT_CONFIG, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-variant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'matSelectCustom3' },
    },
  ],
  templateUrl: './variant.component.html',
  styleUrls: ['./variant.component.scss'],
})
export class VariantComponent implements OnInit {
  variantForm!: FormGroup;
  variant: string = null;
  variantOptions: string[] = ['Size', 'Color'];
  selectedVariants: string[] = [];
  colors = [
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Orange',
    'Black',
    'White',
    'Pink',
    'Gray',
    'Teal',
    'Cyan',
    'Magenta',
    'Lime',
    'Maroon',
    'Olive',
    'Navy',
    'Aquamarine',
    'Turquoise',
    'Silver',
    'Gold',
    'Bronze',
    'Coral',
    'Indigo',
    'Violet',
    'Lavender',
    'Salmon',
    'Beige',
    'Mint',
    'Emerald',
  ];

  ngOnInit() {
    this.variantForm = new FormGroup<any>({
      variant: new FormControl(null, Validators.required),
    });
  }
}
