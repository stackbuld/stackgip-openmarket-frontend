import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ToastrService } from '../../../../../services/toastr.service';
import { v4 as uuidv4 } from 'uuid';
import { take, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
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

interface VariantOptions {
  name: string;
  categoryId: any;
  category: any;
  userId: any;
  id: string;
  createdOn: any;
  createdBy: any;
  updatedBy: any;
  deletedBy: any;
  updatedOn: any;
  deletedOn: any;
  isActive: boolean;
  isDeleted: boolean;
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
export class VariantComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() variantOptions: VariantOptions[] = [];
  @Input() productPrice!: number;
  variant!: FormControl;
  variantOptionsValuesFormGroup!: FormGroup;
  selectedVariantsForm!: FormControl;
  newVariantForm!: FormControl;
  newVariantOptionForm!: FormControl;
  selectedVariants: string[] = [];
  variantOptionsValues: string[] = [];
  stage: number = 0;
  uploadPhotoWidget: any;
  optionsImageIndex: number = 0;
  finishedVariants: Variants[] = [];
  @ViewChild('variantForm1', { static: false })
  variantForm1: ElementRef<HTMLElement>;
  @ViewChild('variantForm2', { static: false })
  variantForm2: ElementRef<HTMLElement>;
  destroy$ = new Subject<void>();
  constructor(
    private dialog: MatDialog,
    private variantService: VariantService,
    private toast: ToastrService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.variant = new FormControl<any>(null, Validators.required);
    this.selectedVariantsForm = new FormControl();
    this.selectedVariantsForm.valueChanges.subscribe((value) => {
      this.selectedVariants = value;
    });
    this.newVariantForm = new FormControl<any>(null);
    this.newVariantOptionForm = new FormControl<any>(null);

    this.variant.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }
      if (value.toLowerCase() == 'size') {
        this.variantOptionsValues = this.variantService.sizes;
      } else if (value == 'color') {
        this.variantOptionsValues = this.variantService.colors;
      }
      this.selectedVariantsForm.setValue(null);
      this.selectedVariants = [];
    });

    this.variantOptionsValuesFormGroup = new FormGroup({
      variantOptionsValuesArray: new FormArray([]),
    });

    this.variantService.variantToEdit.subscribe((variant) => {
      this.stage = 3;
      this.variant.setValue(variant.title);
      this.selectedVariants = [variant.value];
      this.variantOptionsValuesArray.push(
        new FormGroup({
          title: new FormControl(variant.title, Validators.required),
          value: new FormControl(variant.value, Validators.required),
          shortDescription: new FormControl(variant.shortDescription),
          imageUrl: new FormControl(variant.imageUrl),
          cost: new FormControl(variant.cost, Validators.required),
          unit: new FormControl(variant.unit, Validators.required),
          isMultiple: new FormControl(false),
        }),
      );
      this.scrollToFirstInvalidControl();
      console.log(this.variantOptionsValuesArray);
      console.log(variant);
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

    this.variantService.addNewVariant
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.onContinue(1);
        }
      });
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

  onAddNewVariant() {
    const newOption = {
      name: this.newVariantForm.value,
      categoryId: null,
      category: null,
      userId: null,
      id: uuidv4(),
      createdOn: new Date(),
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      updatedOn: null,
      deletedOn: null,
      isActive: true,
      isDeleted: false,
    };
    this.variantOptions.unshift(newOption);
    this.variant.setValue(newOption.name);
    this.newVariantForm.reset();
  }

  onAddNewVariantOption(event: Event) {
    event.stopPropagation();
    const newValue = this.newVariantOptionForm.value;
    this.variantOptionsValues.unshift(newValue);
    this.selectedVariants.push(newValue);
    this.newVariantOptionForm.reset();
  }

  onAddVariant() {
    let hasInvalidPrice = false;

    this.variantOptionsValuesArray.controls.forEach((control) => {
      const cost = control.get('cost').value;
      if (this.productPrice > cost && cost != 0) {
        hasInvalidPrice = true;
        control.get('cost').setErrors({ invalidPrice: true });
      }
    });

    if (hasInvalidPrice) {
      this.toast.warining(
        'Variant price must be zero(0) or have a price above product price!',
      );
      return;
    }

    if (this.variantOptionsValuesFormGroup.invalid) {
      this.variantOptionsValuesFormGroup.markAllAsTouched();
      this.toast.error('All required fields must be filled!');
      return;
    }

    this.stage = 0;
    this.variant.setValue(null);
    this.variantOptionsValues = [];
    this.finishedVariants = [];
    this.variantOptionsValuesArray.controls.forEach((control) => {
      const cost = control.get('cost').value;
      this.finishedVariants.push({
        ...control.value,
        cost: cost == 0 ? 0 : cost - this.productPrice,
      });
    });
    this.variantService.productVariants.next(this.finishedVariants);
    this.variantOptionsValuesArray.clear();
    console.log(this.finishedVariants);
  }

  onContinue(stage: number) {
    console.log(this.productPrice);
    if (!this.productPrice) {
      this.toast.error('Add product price!');
      return;
    }

    this.stage = stage;
    if (stage == 0) {
      this.variant.setValue(null);
      return;
    }
    if (stage < 3) {
      this.scrollToFirstInvalidControl();
    }

    if (stage == 3) {
      this.selectedVariants.map((variant) => {
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
        title: new FormControl(this.variant.value),
        value: new FormControl(option, Validators.required),
        shortDescription: new FormControl(null),
        imageUrl: new FormControl(null),
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
        this.variant.setValue(null);
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

  scrollToFirstInvalidControl() {
    this.changeDetector.detectChanges();

    if (this.stage == 1) {
      let firstInvalidControl = this.variantForm1.nativeElement;
      firstInvalidControl.scrollIntoView();
      (firstInvalidControl as HTMLElement).focus();
    }

    if (this.stage > 1) {
      let firstInvalidControl2 = this.variantForm2.nativeElement;
      firstInvalidControl2.scrollIntoView();
      (firstInvalidControl2 as HTMLElement).focus();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
