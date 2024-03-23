import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormArray,
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
import { VariantService } from './variant.service';
import { environment } from '../../../../../../environments/environment';
declare var cloudinary: any;

interface Variants {
  title: string;
  value: string;
  shortDescription: string | null;
  imageUrl: string;
  cost: number;
  unit: number;
  isMultiple: boolean;
}
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
export class VariantComponent implements OnInit, AfterViewInit {
  variant!: FormControl;
  variantOptions: string[] = ['Select', 'Size', 'Color'];
  selectedVariantsForm!: FormControl;
  selectedVariants: string[] = [];
  variantOptionsValues: string[] = [];
  variantOptionsValuesFormGroup!: FormGroup;
  stage: number = 0;
  uploadPhotoWidget: any;
  optionsImageIndex: number = 0;
  finishedVariants: Variants[] = [];
  constructor(
    private dialog: MatDialog,
    private variantService: VariantService,
  ) {}

  ngOnInit() {
    this.variant = new FormControl<any>('Select', Validators.required);

    this.selectedVariantsForm = new FormControl();

    this.selectedVariantsForm.valueChanges.subscribe((value) => {
      this.selectedVariants = value;
    });

    this.variant.valueChanges.subscribe((value) => {
      if (value == 'Size') {
        this.variantOptionsValues = this.variantService.sizes;
      } else if (value == 'Color') {
        this.variantOptionsValues = this.variantService.colors;
      }
      this.selectedVariantsForm.setValue(null);
      this.selectedVariants = [];
    });

    this.variantOptionsValuesFormGroup = new FormGroup({
      variantOptionsValuesArray: new FormArray([]),
    });

    this.uploadPhotoWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          this.variantOptionsValuesArray.controls.map((control, index) => {
            if (index == this.optionsImageIndex) {
              control.patchValue({ imageUrl: result.info.secure_url });
            }
          });
        }
      },
    );
  }

  onUploadVariantOptionPhoto(id: number): void {
    this.optionsImageIndex = id;
    this.uploadPhotoWidget.open();
  }

  ngAfterViewInit() {}

  get variantOptionsValuesArray() {
    return <FormArray>(
      this.variantOptionsValuesFormGroup.get('variantOptionsValuesArray')
    );
  }

  onAddVariant() {
    this.stage = 0;
    this.finishedVariants = this.variantOptionsValuesArray.value;
    console.log(this.finishedVariants);
  }

  onContinue(stage: number) {
    this.stage = stage;
    const test = [];
    if (stage == 3) {
      this.selectedVariants.map((variant) => {
        test.push(variant);
        this.variantOptionsValuesArray.push(
          new FormGroup({
            title: new FormControl(this.variant.value, Validators.required),
            value: new FormControl(variant, Validators.required),
            shortDescription: new FormControl(null),
            imageUrl: new FormControl(null),
            cost: new FormControl(null, Validators.required),
            unit: new FormControl(null, Validators.required),
            isMultiple: new FormControl(false),
          }),
        );
      });
    }

    this.selectedVariants.forEach((variant) => {
      this.variantOptionsValues = this.variantOptionsValues.filter(
        (option) => option != variant,
      );
    });
  }

  onAddNewOption(option: string) {
    this.selectedVariants.push(option);

    this.variantOptionsValuesArray.push(
      new FormGroup({
        title: new FormControl(this.variant.value, Validators.required),
        value: new FormControl(option, Validators.required),
        shortDescription: new FormControl(null),
        imageUrl: new FormControl(null, Validators.required),
        cost: new FormControl(null, Validators.required),
        unit: new FormControl(null, Validators.required),
        isMultiple: new FormControl(false),
      }),
    );

    this.selectedVariants.forEach((variant) => {
      this.variantOptionsValues = this.variantOptionsValues.filter(
        (option) => option != variant,
      );
    });
  }

  onDeleteVariant() {
    const dialogRef = this.dialog.open(DeleteVariantComponent, {
      panelClass: 'otp_dialog',
    });

    dialogRef.afterClosed().subscribe((event) => {
      if (event) {
        this.stage = 0;
        this.selectedVariants = [];
        this.variantOptionsValues = [];
      }
    });
  }

  onDeleteVariantOption(id: number) {
    const dialoRef = this.dialog.open(DeleteVariantComponent, {
      panelClass: 'otp_dialog',
    });

    dialoRef.afterClosed().subscribe((event) => {
      if (event) {
        const deletedOption = this.selectedVariants.find(
          (variant, index) => index == id,
        );
        this.variantOptionsValues.push(deletedOption);
        this.selectedVariants = this.delete(this.selectedVariants, id);
        this.variantOptionsValuesArray.removeAt(id);
      }
    });
  }

  onRemoveOption(id: number) {
    this.selectedVariants = this.delete(this.selectedVariants, id);
    this.selectedVariantsForm.setValue(this.selectedVariants);
    this.variantOptionsValuesArray.removeAt(id);
  }

  delete(value: any[], id: number) {
    return value.filter((variant, index) => index != id);
  }
}
