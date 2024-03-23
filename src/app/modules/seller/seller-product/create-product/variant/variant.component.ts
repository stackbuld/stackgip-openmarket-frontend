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
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DeleteVariantComponent } from './delete-variant/delete-variant.component';

@Component({
  selector: 'app-variant',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
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
  variant: string = 'Select';
  variantOptions: string[] = ['Select', 'Size', 'Color'];
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
  stage: number = 0;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.variantForm = new FormGroup<any>({
      variant: new FormControl(null, Validators.required),
    });
  }

  onAddVariant() {
    this.stage = 0;
  }

  onContinue(stage: number) {
    this.stage = stage;
    console.log(stage);
  }

  onShowOptions(event: Event) {
    event.stopPropagation();
  }

  onDeleteVariant() {
    const dialoRef = this.dialog.open(DeleteVariantComponent, {
      panelClass: 'otp_dialog',
    });

    dialoRef.afterClosed().subscribe((event) => {
      if (event) {
        console.log(1);
      }
    });
  }

  onRemoveOption(id: number) {
    this.selectedVariants = this.selectedVariants.filter(
      (variant, index) => index != id,
    );
  }
}
