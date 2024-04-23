import { IUser } from '../../../../models/IUserModel';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CreateProductResponse } from '../../../../models/products.model';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Inject,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { ProductsService } from '../../../../services/products/products.service';
import { ToastrService } from '../../../../services/toastr.service';
import { StoreService } from 'src/app/services/store/store.service';
import uikit from 'uikit';

import { DOCUMENT } from '@angular/common';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { SellerStoreCreateDialogComponent } from '../../seller-store/seller-store-create-dialog/seller-store-create-dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safehtml.pipe';
import { MatDialog } from '@angular/material/dialog';
import { VariationsAlertDialogComponent } from './variations-alert-dialog/variations-alert-dialog.component';
import { VariantComponent } from './variant/variant.component';
import { VariantService } from './variant/variant.service';
import { DeleteVariantComponent } from './variant/delete-variant/delete-variant.component';

declare var cloudinary: any;
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
  providers: [SafeHtmlPipe],
})
export class CreateProductComponent
  implements OnInit, AfterViewChecked, OnDestroy
{
  previewEditorConfig: AngularEditorConfig = {
    editable: false,
    showToolbar: false,
    enableToolbar: false,
    height: 'auto',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '10rem',
  };
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '15rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '10rem',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Product short description...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    toolbarHiddenButtons: [
      [
        'strikeThrough',
        'subscript',
        'superscript',
        'colorPicker',
        'justifyFull',
        'outdent',
        'eyedrop',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ],

    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
  };
  pickupOptions: [
    {
      name: 'None';
    },
    {
      name: 'Bike';
    },
    {
      Car;
    },
    {
      name: 'Van';
    },
    {
      name: 'Truck';
    }
  ];
  private unsubscribe$ = new Subject<void>();
  @Output() closed = new EventEmitter();
  @Output() added = new EventEmitter();
  errors: any[];
  errorMessage: string;
  form: FormGroup;
  newVariationForm: FormGroup;
  cproduct: CreateProductResponse;
  editProps: any;
  variationProps: FormGroup;
  categories: any;
  stores: any;
  loading: boolean = false;
  uploadWidget: any;
  uploadComplimentaryWidget: any;
  images = [];
  variationImages = [];
  newImageListForUpdate: any;
  complimentartImages = [];
  states: string[] = nigeriaSates.map((a) => a.name);
  productVariations: any[];
  allVariantList = [];
  user = {} as IUser;
  isPreview = false;
  relatedItems = [];
  previewData: any;
  uploadComplimentaryWidget2: any;
  uploadComplimentaryWidget3: any;
  complementaryProducts: any[] = [];
  complimentaryIndex: any;
  complementaryImagesStore = [];
  imageShow: string;
  previewImg: string;
  productImage = null;
  addingVariation = false;
  addingComplimentaryOptions = false;
  variationList: any;
  subCategories: any;
  selectedCategoryId = null;
  creatingVariation: boolean;
  loadingSubCategories: boolean;
  creatingProduct: boolean;
  productId = null;
  isFullDescription = false;
  hasFullDesc: boolean;
  imageErr: string;
  previewDesc: any;
  uniqueVariant: any;
  initialProductUnit: number = 0;
  availableProductUnit: number = 0;
  editingTotalVariationsUnit: number = 0;
  editingVariation: boolean = false;
  editingIndex: number = null;
  editingVariationUnit: number = 0;
  isProductUnitExceeded: boolean = false;
  videoUrls: string[] = [];
  videoWidget: any;
  isAddingVariants: boolean = false;

  savedTotalVariantsUnit: number = 0;

  @ViewChild('variationForm', { static: false })
  variationForm: ElementRef<HTMLElement>;

  @ViewChild('variantComponent') variantComponent: VariantComponent;

  @ViewChild('complementaryForm', { static: false })
  complementaryForm: ElementRef<HTMLElement>;

  @ViewChild('complementaryItemNameInput', { static: false })
  complementaryItemNameInput: ElementRef<HTMLElement>;

  @ViewChild('availableUnitsContainer', { static: false })
  availableUnitsContainer: ElementRef<HTMLElement>;

  @ViewChild('availableUnitsInput', { static: false })
  availableUnitsInput: ElementRef<HTMLElement>;

  exceededUnitAction$: Subscription;
  isScroll: boolean = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private safeHtml: SafeHtmlPipe,
    private productService: ProductsService,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private dialogService: DialogService,
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private variantService: VariantService
  ) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.initVariationForm();
    localStorage.removeItem('compImagesStore');
    this.user = this.authService.getLoggedInUser();
  }

  get f() {
    return this.form.controls;
  }

  get categoryId() {
    return this.form.get('categoryId');
  }

  ngOnInit(): void {
    this.formInit();
    this.variationProps = this.createVariation();

    this.variantService.productVariants.subscribe((values) => {
      if (!values) {
        return;
      }
      if (values.length != 0) {
        if (this.editingVariation) {
          this.allVariantList[this.editingIndex] = {
            ...values[0],
            id: this.allVariantList[this.editingIndex].id,
          };
          this.variations()
            .at(this.editingIndex)
            .setValue({
              ...values[0],
            });
          this.editingIndex = null;
        } else {
          this.allVariantList = [...this.allVariantList, ...values];
          values.map((value) => {
            this.variations().push(this.fb.group(value));
          });
          this.allVariantList.forEach(
            (v) => (this.savedTotalVariantsUnit += v.unit)
          );
        }

        // this.totalVariationsUnit = this.getTotalVariationUnit(
        //   this.allVariantList
        // );
        this.editingVariation = false;
        this.addingVariation = false;
      }
    });

    if (this.productId !== null) {
      this.getProduct(this.productId);
    }
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
    this.getCategories();
    this.getStores(this.user.id);
    this.getVariations();

    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          if (this.images.length < 4) {
            this.images.push(result.info.secure_url);
            this.productImage = this.images[0];
            this.form.patchValue({ imageUrls: this.images });
          }
        }
      }
    );

    this.videoWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['gif', 'mp4'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          if (this.videoUrls.length < 4) {
            this.videoUrls.push(result.info.secure_url);
          }
        }
      }
    );

    this.uploadComplimentaryWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          let list = [];
          if (JSON.parse(localStorage.getItem('compImagesStore')) === null) {
            let data = {
              id: this.complimentaryIndex,
              imageUrl: result.info.secure_url,
            };
            list.push(data);
            localStorage.setItem('compImagesStore', JSON.stringify(list));
            this.complementaryImagesStore = JSON.parse(
              localStorage.getItem('compImagesStore')
            );
          } else {
            list = JSON.parse(localStorage.getItem('compImagesStore'));
            let data = {
              id: this.complimentaryIndex,
              imageUrl: result.info.secure_url,
            };
            list.push(data);
            localStorage.setItem('compImagesStore', JSON.stringify(list));
            this.complementaryImagesStore = JSON.parse(
              localStorage.getItem('compImagesStore')
            );
          }
        }
      }
    );

    this.uploadComplimentaryWidget2 = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          if (this.editProps.value.imageUrl == '') {
            this.editProps.patchValue({ imageUrl: result.info.secure_url });
          }
        }
      }
    );

    this.uploadComplimentaryWidget3 = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          if (this.variationProps.value.imageUrl == '') {
            this.variationProps.patchValue({
              imageUrl: result.info.secure_url,
            });
          }
        }
      }
    );

    this.form.get('unit').valueChanges.subscribe((value: number) => {
      if (!this.editingVariation) {
        this.availableProductUnit = value;
      }
      this.initialProductUnit = value;
    });

    this.getUnitValues();

    this.productService.newProductUnit.subscribe((value) => {
      this.initialProductUnit = value;
      this.availableProductUnit = 0;
      this.form.patchValue({ unit: value });

      this.isProductUnitExceeded = false;
    });

    this.exceededUnitAction$ = this.productService.exceededUnitAction.subscribe(
      (action) => {
        if (action) {
          this.isScroll = true;
          setTimeout(() => {
            window.scrollTo(
              0,
              this.availableUnitsContainer.nativeElement.offsetTop
            );
          }, 100);
          this.availableUnitsInput.nativeElement.focus();
        }
      }
    );

    this.variantService.isAddingVariant.subscribe((value) => {
      this.isAddingVariants = value;
    });
  }

  ngAfterViewChecked(): void {}

  addStore() {
    this.dialogService
      .openDialog(SellerStoreCreateDialogComponent, {
        data: { data: null, mode: 'create' },
      })
      .afterClosed()
      .subscribe((response) => {
        response ? this.getStores(this.user.id) : null;
      });
  }

  preventLetter(evt: any): boolean {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  setComplementaryImageForUpdate(data: any) {
    localStorage.removeItem('compImagesStore');
    for (let index = 0; index < data.productOptions.length; index++) {
      const element = data.productOptions[index];
      if (element.isMultiple === true) {
        this.complementaryImagesStore.push(element);
      }
    }
    localStorage.setItem(
      'compImagesStore',
      JSON.stringify(this.complementaryImagesStore)
    );
  }

  getProduct(id: any) {
    this.loading = true;
    this.productService.getProduct(id).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.loading = false;
          this.initialProductUnit = res.data.unit;
          this.populateProductForm(res.data);
          this.getSubCategories(res.data.category.id);
          this.setComplementaryImageForUpdate(res.data);
          this.images = res.data.productImages;

          this.productImage = this.images[0];
          this.videoUrls = res.data.videoUrls;
        } else {
          this.toast.error(res.message);
          this.loading = false;
        }
      },
      (err) => {
        this.toast.error(err.error.message);
        this.loading = false;
      }
    );
  }

  formInit(): void {
    this.form = this.fb.group({
      userId: [this.user.id, [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required]],
      weight: [1, [Validators.required]],
      previousPrice: [0],
      imageUrls: [null],
      pickupOption: [null, Validators.required],
      imageUrl: [''],
      categoryId: [''],
      category: ['', [Validators.required]],
      storeIds: [[], [Validators.required]],
      unit: [null, [Validators.required]],
      options: this.fb.array([]),
      variations: this.fb.array([]),
    });
  }

  populateProductForm(data: any): void {
    let variationList = [];
    let complimentartProducts = [];
    let sellerStoreIds = [];
    this.allVariantList = [];
    this.form = this.fb.group({
      userId: [this.user.id],
      name: [data.name, [Validators.required]],
      description: [data.description, [Validators.required]],
      price: [data.price, [Validators.required]],
      weight: [data.weight, [Validators.required]],
      previousPrice: [data.previousPrice === '' ? 0 : data.previousPrice],
      imageUrls: [data.productImages],
      pickupOption: [data.pickupOption, [Validators.required]],
      imageUrl: [data.imageUrl],
      categoryId: [data.categoryId, [Validators.required]],
      category: [data.categoryId, [Validators.required]],
      videoUrls: [data.videoUrls],
      storeIds: [sellerStoreIds, [Validators.required]],
      unit: [data.unit, [Validators.required]],
      options: this.fb.array([]),
      variations: this.fb.array([]),
      draftProductId: [data.draftProductId],
    });

    for (let index = 0; index < data.sellerStores.length; index++) {
      const element = data.sellerStores[index];
      sellerStoreIds.push(element.id);
    }

    for (let index = 0; index < data.productOptions.length; index++) {
      const element = data.productOptions[index];

      if (!!element.isMultiple) {
        complimentartProducts.push(element);
        this.relatedItems.push(element);
      }

      if (element.isMultiple === false) {
        variationList.push(element);
        this.allVariantList.push(element);
      }
    }

    // this.totalVariationsUnit = this.getTotalVariationUnit(this.allVariantList);

    // this.availableProductUnit =
    //   this.initialProductUnit - this.totalVariationsUnit;

    // this.relatedItems.forEach((element: any, index: number) => {
    //   (<FormArray>this.form.get('options')).push(
    //     this.fb.group({
    //       title: [element.title, [Validators.required]],
    //       value: [element.value],
    //       cost: [element.cost],
    //       shortDescription: [element.shortDescription],
    //       unit: [element.unit],
    //       imageUrl: [''],
    //       isMultiple: [element.isMultiple],
    //       ...(element.id && {id: element.id} )
    //     })
    //   );
    // });

    this.allVariantList.forEach((element: any, index: number) => {
      (<FormArray>this.form.get('variations')).push(
        this.fb.group({
          title: [element.title, [Validators.required]],
          value: [element.value],
          cost: [element.cost, [Validators.required]],
          unit: [element.unit, [Validators.required]],
          imageUrl: [element.imageUrl],
          isMultiple: false,
          shortDescription: element.shortDescription,
          ...(element.id && { id: element.id }),
        })
      );
    });

    this.relatedItems.forEach((element: any, index: number) => {
      (<FormArray>this.form.get('options')).push(
        this.fb.group({
          title: [element.title, [Validators.required]],
          shortDescription: [element.shortDescription, Validators.required],
          value: [''],
          unit: [element.unit],
          imageUrl: [element.imageUrl],
          cost: [element.cost, [Validators.required]],
          isMultiple: true,
          ...(element.id && { id: element.id }),
        })
      );
    });
  }

  getUnitValues() {
    // if (this.variationProps.get('unit').value === null) {
    //   return;
    // }
    //
    // this.variationProps.get('unit').valueChanges.subscribe((value) => {
    //   let totalVariationValue = 0;
    //
    //   if (value === null) {
    //     this.availableProductUnit =
    //       this.initialProductUnit - this.totalVariationsUnit;
    //
    //     return;
    //   }
    //
    //   totalVariationValue = value + this.totalVariationsUnit;
    //
    //   if (this.editingVariation) {
    //     this.availableProductUnit =
    //       this.initialProductUnit - totalVariationValue;
    //   } else {
    //     this.availableProductUnit =
    //       this.initialProductUnit - (value + this.totalVariationsUnit);
    //   }
    //
    //   if (this.availableProductUnit < 0) {
    //     this.isProductUnitExceeded = true;
    //   } else {
    //     this.isProductUnitExceeded = false;
    //   }
    //
    //   if (totalVariationValue > this.initialProductUnit) {
    //     this.isProductUnitExceeded = true;
    //
    //     this.dialog.open(VariationsAlertDialogComponent, {
    //       data: {
    //         initialUnit: this.initialProductUnit,
    //         exceededUnit: totalVariationValue,
    //         type: 'unitAlert',
    //       },
    //       autoFocus: false,
    //     });
    //   } else {
    //     this.isProductUnitExceeded = false;
    //   }
    // });
  }

  // creating a new varaint type (for add variation)
  initVariationForm(): void {
    this.newVariationForm = this.fb.group({
      name: ['', [Validators.required]],
      // categoryId: ['', [Validators.required]],
    });
  }

  createNewVariation() {
    this.creatingVariation = true;
    // this.selectedCategoryId = this.newVariationForm.value.categoryId;
    this.productService.createVariation(this.newVariationForm.value).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.document.getElementById('closeVariationModalBtn').click();
          this.creatingVariation = false;
          this.toast.success(res.message);
          this.getVariations();
          this.initVariationForm();
        } else {
          this.creatingVariation = false;
          this.toast.success(res.message);
        }
      },
      (err) => {
        this.creatingVariation = false;
        this.toast.error(err.message);
      }
    );
  }

  changeUnit = (unit: any, type: string) => {
    let it = parseInt(unit);
    if (type === 'add') {
      this.form.patchValue({ unit: it + 1 });
      this.previewData.unit = it + 1;
    }
    if (type === 'minus') {
      if (it > 1) {
        this.form.patchValue({ unit: it - 1 });
        this.previewData.unit = it - 1;
      }
    }
  };

  variations(): FormArray {
    return this.form.get('variations') as FormArray;
  }

  createVariation(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      value: ['', [Validators.required]],
      cost: [0, [Validators.required]],
      imageUrl: [''],
      shortDescription: [null],
      unit: ['', Validators.required],
      isMultiple: false,
    });
  }

  scrollToFirstInvalidControl() {
    this.changeDetector.detectChanges();

    let firstInvalidControl = this.variationForm.nativeElement;

    firstInvalidControl.scrollIntoView();
    (firstInvalidControl as HTMLElement).focus();
  }

  // this method is to open the variation of products card

  addVariation(): void {
    if (
      this.form.get('price').value === 0 ||
      this.form.get('price').value === null
    ) {
      this.toast.error('Add product price!');
      return;
    }
    this.allVariantList.forEach((v) => (this.savedTotalVariantsUnit += v.unit));
    this.variantService.addNewVariant.next(true);
    // this.addingVariation = true;
    // this.variationProps = this.createVariation();
    // this.scrollToFirstInvalidControl();
    //
    // this.getUnitValues();
    // this.variationProps.patchValue({ imageUrl: '' });
    //
    // if (!this.editingVariation) {
    //   if (this.availableProductUnit > 0) {
    //     const unit = Math.floor(this.availableProductUnit / 2);
    //     if (unit == 0) {
    //       this.variationProps.patchValue({ unit: null });
    //     } else {
    //       this.variationProps.patchValue({ unit: unit });
    //     }
    //   }
    // }
  }

  // this method is to add the variation to the variation variable of the main form

  addProductVariation() {
    if (this.variationProps.invalid) {
      this.variationProps.markAllAsTouched();
      this.toast.error('All required fields must be valid');

      return;
    }

    if (this.isProductUnitExceeded) {
      this.toast.warining(
        'Product variations unit can not be more than product unit'
      );
      return;
    }

    if (
      this.variationProps.value.cost < this.form.get('price').value &&
      this.variationProps.value.cost !== 0
    ) {
      this.toast.warining(
        'Variant must be zero(0) or have a price above product price!'
      );
      return;
    }

    const variantCost =
      this.variationProps.value.cost === 0
        ? 0
        : this.variationProps.value.cost - this.form.get('price').value;

    this.variations().push(this.variationProps);
    if (this.editingVariation) {
      this.allVariantList[this.editingIndex] = this.variationProps.value;
    } else {
      this.allVariantList.push({
        ...this.variationProps.value,
        cost: variantCost,
      });
    }

    // this.totalVariationsUnit = this.getTotalVariationUnit(this.allVariantList);

    this.editingVariation = false;
    this.editingVariationUnit = 0;

    this.toast.success('Product variant added');
    this.addingVariation = false;
  }

  getTotalVariationUnit(list: any[]) {
    return list.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.unit;
    }, 0);
  }

  // this method is to close the variation of products card
  removeEditVariation(): void {
    uikit.modal('#delete-modal').show();
  }

  onCancelRemoveEditVariation() {
    uikit.modal('#delete-modal').hide();
  }

  // onConfirmRemoveEditVariation() {
  //   this.variationProps.reset();
  //   this.editingTotalVariationsUnit = 0;
  //   this.totalVariationsUnit += this.editingVariationUnit;
  //   this.editingVariationUnit = 0;
  //   this.addingVariation = false;
  //   this.editingVariation = false;
  //   uikit.modal('#delete-modal').hide();
  // }

  // this method is to remove already created product varaints
  removeVariation(index: number): void {
    const dialogRef = this.dialog.open(DeleteVariantComponent, {
      panelClass: 'otp_dialog',
    });

    dialogRef.afterClosed().subscribe((event) => {
      if (event) {
        this.variations().removeAt(index);

        this.variantService.deletingVariantUnit.next(
          this.allVariantList[index].unit
        );
        this.allVariantList.splice(index, 1);
        if (this.allVariantList.length <= 0) {
          this.savedTotalVariantsUnit = 0;
        } else {
          this.savedTotalVariantsUnit -= this.allVariantList[index].unit;
        }
      }
    });
  }

  // this method is to edit already created related/complimentary product
  editVariation(index: number): void {
    this.editingVariation = true;
    this.editingIndex = index;
    this.variantService.variantToEdit.next(this.allVariantList[index]);
  }

  options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  createOptions(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      shortDescription: ['', [Validators.required]],
      value: [''],
      unit: ['', Validators.required],
      imageUrl: ['', Validators.required],
      cost: [null, [Validators.required]],
      isMultiple: true,
    });
  }

  showImg(img: string) {
    this.previewImg = img;
  }

  toggleActiveProductImage(img: string) {
    this.productImage = img;
  }

  // this method is to open the complimentary/related products card
  addEditOption(): void {
    this.addingComplimentaryOptions = true;
    this.editProps = this.createOptions();
    this.changeDetector.detectChanges();
    this.complementaryForm.nativeElement.scrollIntoView();
    this.complementaryItemNameInput.nativeElement.focus();
  }

  // this method is to add the complimentary/related products card to the options variable of the main form
  addProductOption(): void {
    if (this.editProps.invalid) {
      this.editProps.markAllAsTouched();
      this.toast.error(`All required fields must be valid`);
      return;
    }

    this.addingComplimentaryOptions = false;
    this.options().push(this.editProps);
    this.relatedItems.push(this.editProps.value);
  }

  // this method is to close the complimentary/related products card
  removeEditOption(): void {
    this.addingComplimentaryOptions = false;
    this.editProps.reset();
  }

  // this method is to remove already created complimentary products
  removeRelated(index: number) {
    this.options().removeAt(index);
    this.relatedItems.splice(index, 1);
  }

  // this method is to edit already created related/complimentary product
  editRelated(index: number): void {
    this.addingComplimentaryOptions = true;

    // this is vital for when coming from edit in products page. Needs refactoring though
    if (!this.editProps) {
      this.editProps = this.createOptions();
    }
    this.editProps.patchValue({ ...this.relatedItems[index] });
    this.removeRelated(index);
  }

  // images upload start
  upload(): void {
    if (this.images.length < 4) {
      this.uploadWidget.open();
    } else {
      this.imageErr = 'You can only upload maximum of four images';
    }
  }

  onUploadVideo() {
    if (this.videoUrls.length >= 4) {
      this.toast.warining('You can only upload up to four videos');
      return;
    }

    this.videoWidget.open();
  }

  onDeleteVideo(index: number) {
    this.videoUrls = this.videoUrls.filter(
      (url, urlIndex) => urlIndex != index
    );
  }

  removeImage(image_url): void {
    this.imageErr = null;
    this.images = this.images.filter((a) => a !== image_url);
    this.form.patchValue({ imageUrls: this.images });
    this.productImage = this.images[0];
    if (this.images.length === 0) {
      this.productImage = null;
    }
  }

  removeVariationImage(image_url): void {
    this.imageErr = null;
    this.variationImages = this.variationImages.filter((a) => a !== image_url);
    this.variationProps.patchValue({ imageUrl: '' });
  }

  removeRelatedImage(): void {
    this.imageErr = null;
    this.editProps.patchValue({ imageUrl: '' });
  }

  uploadComplimentaryImage(): void {
    if (this.variationProps.value.imageUrl == '') {
      this.uploadComplimentaryWidget3.open();
    } else {
      this.imageErr = 'You can only upload maximum of one images';
    }
  }

  uploadRelatedImage(): void {
    if (this.editProps.value.imageUrl == '') {
      this.uploadComplimentaryWidget2.open();
    } else {
      this.imageErr = 'You can only upload maximum of one images';
    }
  }

  removeComplimentaryImage(id: any): void {
    for (let index = 0; index < this.form.value.options.length; index++) {
      const element = this.form.value.options[index];
      if (index === id) {
        element.imageUrl = '';
      }
    }
  }
  // images upload stop

  getSubCategories(id: any) {
    this.subCategories = [];
    this.form.value.categoryId = '';
    this.loadingSubCategories = true;
    this.selectedCategoryId = id;
    this.getVariations();
    this.newVariationForm.patchValue({ categoryId: this.selectedCategoryId });
    this.productService.getSubCategories(id).subscribe(
      (res) => {
        this.subCategories = res.data;
        this.getVariations();
        this.loadingSubCategories = false;
      },
      (err) => {
        this.toast.error(err.message);
        this.loadingSubCategories = false;
      }
    );
  }

  getCategories() {
    this.productService.getAllCategories().subscribe(
      (res) => {
        this.categories = res.data;
      },
      (err) => {
        this.toast.error(err.message);
      }
    );
  }

  getVariations() {
    this.productService.getVariations(this.user.id).subscribe(
      (res) => {
        this.productVariations = res.data.data;
      },
      (err) => {
        this.toast.error(err.message);
      }
    );
  }

  getStores(id: any) {
    this.storeService.getStoresById(id).subscribe(
      (res) => {
        this.stores = res.data;
      },
      (err) => {
        this.toast.error(err.message);
      }
    );
  }

  edit = () => {
    // if (this.isSubCatIdEmpty === true) {
    //   this.form.patchValue({ categoryId: '' });
    // }
    if (this.isPreview === true) {
      this.isPreview = false;
    }
  };

  setVariation(list: any) {
    const result = list.reduce((acc, { title, value }) => {
      acc[title] ??= { title: title, value: [] };
      if (Array.isArray(value))
        // if it's array type then concat
        acc[title].value = acc[title].value.concat(value);
      else acc[title].value.push(value);
      return acc;
    }, {});
    this.variationList = Object.values(result);
  }

  updateProduct = () => {
    this.creatingProduct = true;
    this.productService
      .createNewProduct({
        ...this.form.value,
        videoUrls: this.videoUrls,
        options: [...this.relatedItems, ...this.allVariantList],
        publishOption: 'Review',
        draftProductId: this.productId,
      })
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toast.success('Product updated successfully!');
            this.router.navigate(['/seller/products']);
            this.creatingProduct = false;
            localStorage.removeItem('compImagesStore');
            this.complementaryImagesStore = [];
          } else {
            this.creatingProduct = false;
            this.toast.error(res.message);
          }
        },
        error: (err) => {
          this.creatingProduct = false;
          this.toast.error(err.message);
        },
      });
  };

  toggleDescription() {
    this.isFullDescription = !this.isFullDescription;
  }

  convertInnerHtmlToString(myHTML: any) {
    // var strippedHtml = myHTML.replace(/<[^>]+>/g, "");
    // if (strippedHtml.length > 700) {
    //   this.hasFullDesc = true;
    // } else {
    //   this.hasFullDesc = false;
    // }
    // return strippedHtml;
    return myHTML;
  }

  createProduct = () => {
    this.creatingProduct = true;

    this.productService
      .createNewProduct({
        ...this.form.value,
        videoUrls: [...this.videoUrls],
        options: [...this.relatedItems, ...this.allVariantList],
        publishOption: 'Review',
      })
      .subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.toast.success('Product added successfully');
            this.router.navigate(['/seller/products']);

            this.creatingProduct = false;
            localStorage.removeItem('compImagesStore');
            this.complementaryImagesStore = [];
          } else {
            this.creatingProduct = false;
            this.toast.error('Something went wrong');
          }
        },
        error: (err) => {
          this.creatingProduct = false;
          this.toast.error('Something went wrong');
        },
      });
  };

  saveAsDraft = () => {
    if (this.form.value.pickupOption === 'None') {
      this.toast.warining(
        'Please select a pickup option (what kind of vehicle can pick up this item)'
      );
      return;
    }
    if (this.images?.length < 1) {
      this.toast.error('Product Image(s) required');
      // return;
    } else if (this.form.value.description === '') {
      this.toast.error('Enter Product Description to Process');
      // return;
    } else if (this.form.value.category == '') {
      this.toast.error('Select a Category');
      // return;
    } else if (this.form.invalid) {
      this.toast.error('All required fields must be available');
      // return;
    } else {
      if (this.subCategories?.length === 0 && this.form.value.category !== '') {
        this.isSubCatIdEmpty = true;
        this.form.patchValue({ categoryId: this.form.value.category });
      }

      if (this.form.valid) {
        if (!this.isAddingVariants) {
          this.creatingProduct = true;
          this.form.patchValue({ imageUrl: this.form.value.imageUrls[0] });
          this.mainSaveAsDrafts();
          return;
        }

        const dialogRef = this.dialog.open(VariationsAlertDialogComponent, {
          data: {
            initialUnit: 0,
            exceededUnit: 0,
            type: 'addingVariantAlert',
          },
          autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((value) => {
          if (!value) {
            return;
          }
          this.creatingProduct = true;
          this.variantService.isAddingVariant.next(false);
          this.form.patchValue({ imageUrl: this.form.value.imageUrls[0] });
          this.mainSaveAsDrafts();
        });
      }
    }
  };

  mainSaveAsDrafts() {
    this.productService
      .createNewProduct({
        ...this.form.value,
        videoUrls: [...this.videoUrls],
        options: [...this.relatedItems, ...this.allVariantList],
        publishOption: 'Draft',
        ...(this.productId && { draftProductId: this.productId }),
      })
      .subscribe(
        (res) => {
          if (res.status === 'success') {
            this.toast.success('Product saved as draft Successful!');
            this.router.navigate(['/seller/products']);
            this.creatingProduct = false;
            localStorage.removeItem('compImagesStore');
            this.complementaryImagesStore = [];
          } else {
            this.creatingProduct = false;
            this.toast.error('Something went wrong');
          }
        },
        (err) => {
          this.creatingProduct = false;
          this.toast.error('Something went wrong');
        }
      );
  }
  isSubCatIdEmpty = false;
  onSubmit() {
    if (this.form.value.pickupOption === 'None') {
      this.form.markAllAsTouched();
      this.toast.warining(
        'Please select a pickup option (what kind of vehicle can pick up this item'
      );
      return;
    }
    if (this.images?.length < 1) {
      this.toast.error('Product Image(s) required');
      // return;
    } else if (this.form.value.description === '') {
      this.toast.error('Enter Product Description to Procees');
      // return;
    } else if (this.form.value.category == '') {
      this.toast.error('Select a Category');
      // return;
    } else if (this.form.get('storeIds').invalid) {
      this.toast.error('Must select a store!');
      return;
    } else if (this.form.invalid) {
      this.toast.error('All required fields must be available');
      // return;
    } else {
      if (this.subCategories.length === 0 && this.form.value.category !== '') {
        this.isSubCatIdEmpty = true;
        this.form.patchValue({ categoryId: this.form.value.category });
      }

      if (this.form.valid) {
        if (!this.isAddingVariants) {
          this.proceedToSave();
          return;
        }
        const dialogRef = this.dialog.open(VariationsAlertDialogComponent, {
          data: {
            initialUnit: 0,
            exceededUnit: 0,
            type: 'addingVariantAlert',
          },
          autoFocus: false,
        });

        dialogRef.afterClosed().subscribe((value) => {
          if (!value) {
            return;
          }
          this.variantService.isAddingVariant.next(false);
          this.proceedToSave();
        });
      }
    }
  }

  proceedToSave() {
    this.form.patchValue({ imageUrl: this.form.value.imageUrls[0] });
    this.previewImg = this.form.value.imageUrls[0];
    this.previewData = this.form.value;
    this.uniqueVariant = [
      ...new Set(this.allVariantList.map((item) => item.title)),
    ].map((variant) => {
      let newVariant = this.allVariantList.filter(
        (item) => item.title === variant
      );
      return {
        variant: variant,
        properties: [...newVariant],
      };
    });
    this.isPreview = true;
    this.previewDesc = this.safeHtml.transform(this.form.value.description);
  }

  setComplementaryProducts() {
    if (JSON.parse(localStorage.getItem('compImagesStore'))) {
      this.complementaryImagesStore = JSON.parse(
        localStorage.getItem('compImagesStore')
      );
    } else {
      this.complementaryImagesStore = [];
    }
    // this.complementaryImagesStore = JSON.parse(localStorage.getItem('compImagesStore'));
    for (let index = 0; index < this.form.value.options.length; index++) {
      const element = this.form.value.options[index];
      for (let i = 0; i < this.complementaryImagesStore.length; i++) {
        const el = this.complementaryImagesStore[i];
        if (index === i) {
          element.imageUrl = el.imageUrl;
        }
      }
    }
  }

  deleteProduct(): void {
    uikit.modal.confirm('Are you sure that you want to delete product ?').then(
      () => {
        this.loading = true;
        this.productService.deleteProduct(this.productId).subscribe((res) => {
          if (res.status === 'success') {
            this.loading = false;
            this.toast.success(res.message);
            this.router.navigate(['/seller/products']);
          } else {
            this.loading = false;
            this.toast.error(res.message);
          }
        });
      },
      (err) => {
        this.loading = false;
        this.toast.error(err.message);
      }
    );
  }

  ngOnDestroy(): void {
    this.variantService.productVariants.next(null);
    this.variantService.isAddingVariant.next(false);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
