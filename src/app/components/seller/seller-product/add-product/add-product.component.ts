import { Router, ActivatedRoute } from '@angular/router';
import { CreateProductResponse } from './../../../../models/products.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { nigeriaSates } from 'src/app/data/nigeriastates';
import { ProductsService } from '../../../../services/products/products.service';
import { ToastrService } from './../../../../services/toastr.service';
import { getLoggedInUser } from 'src/app/helpers/userUtility';
import { StoreService } from 'src/app/services/store/store.service';
import uikit from 'uikit';
// import { AngularEditorConfig } from "@kolkov/angular-editor";
// import * as CkEditor from 'rena-ckeditor5-custom-build/build/ckeditor';
import { editorDefaultConfig } from 'src/app/shared/config/ckeditor.config';
import { DOCUMENT } from '@angular/common';

declare var cloudinary: any;
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: [
    './add-product.component.scss',
    '../../../../shared/css/spinner.css',
  ],
})
export class AddProductComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  @Output() closed = new EventEmitter();
  @Output() added = new EventEmitter();
  errors: any[];
  errorMessage: string;
  form: FormGroup;
  newVariationForm: FormGroup;
  cproduct: CreateProductResponse;
  categories: any;
  stores: any;
  // categories$: Observable<CategoryResponse>;
  // stores$: Observable<StoreResponse>;
  loading: boolean = false;
  uploadWidget: any;
  uploadComplimentaryWidget: any;
  images = [];
  newImageListForUpdate: any;
  complimentartImages = [];
  states: string[] = nigeriaSates.map((a) => a.name);
  productVariations: any[];
  // productVariations: string[] = variations;
  user = getLoggedInUser();
  isPreview = false;
  previewData: any;

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

  // public Editor = CkEditor;

  editorDefaultConfig = editorDefaultConfig;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private productService: ProductsService,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('id');
    this.formInit();
    this.initVariationForm();
    localStorage.removeItem('compImagesStore');
  }

  get f() {
    return this.form.controls;
  }

  get categoryId() {
    return this.form.get('categoryId');
  }

  ngOnInit(): void {
    if (this.productId !== null) {
      this.getProduct(this.productId);
    }
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
    this.getCategories();
    this.getStores(this.user.id);
    this.getVariations();
    // this.categories$ = this.catgoryService.GetCategory();
    // this.stores$ = this.storeService.getStoresByUserId(this.user.id);
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
          this.populateProductForm(res.data);
          this.getSubCategories(res.data.category.id);
          this.setComplementaryImageForUpdate(res.data);
          this.newImageListForUpdate = res.data.productImages;
          this.images = this.newImageListForUpdate;
          this.productImage = this.images[0];
          this.form.patchValue({ imageUrls: this.images });
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
      weight: [null, [Validators.required]],
      previousPrice: [0],
      imageUrls: [null],
      imageUrl: [''],
      categoryId: [''],
      category: ['', [Validators.required]],
      storeIds: [[], [Validators.required]],
      unit: [null, [Validators.required]],
      variations: this.fb.array([]),
      options: this.fb.array([]),
    });
  }

  populateProductForm(data: any): void {
    let variationList = [];
    let complimentartProducts = [];
    let sellerStoreIds = [];
    this.form = this.fb.group({
      userId: [this.user.id],
      name: [data.name, [Validators.required]],
      description: [data.description, [Validators.required]],
      price: [data.price, [Validators.required]],
      weight: [data.weight, [Validators.required]],
      previousPrice: [data.previousPrice],
      imageUrls: [null],
      imageUrl: [data.imageUrl],
      categoryId: [data.categoryId, [Validators.required]],
      category: [data.category.id, [Validators.required]],
      storeIds: [sellerStoreIds, [Validators.required]],
      unit: [data.unit, [Validators.required]],
      variations: this.fb.array([]),
      options: this.fb.array([]),
    });
    for (let index = 0; index < data.sellerStores.length; index++) {
      const element = data.sellerStores[index];
      sellerStoreIds.push(element.id);
    }
    for (let index = 0; index < data.productOptions.length; index++) {
      const element = data.productOptions[index];
      if (element.isMultiple === true) {
        complimentartProducts.push(element);
      }
      if (element.isMultiple === false) {
        variationList.push(element);
      }
    }
    variationList.forEach((element: any, index: number) => {
      (<FormArray>this.form.get('variations')).push(
        this.fb.group({
          title: [element.title, [Validators.required]],
          value: [element.value, [Validators.required]],
          cost: [element.cost, [Validators.required]],
          shortDescription: [''],
          imageUrl: [''],
          isMultiple: false,
        })
      );
    });
    complimentartProducts.forEach((element: any, index: number) => {
      (<FormArray>this.form.get('options')).push(
        this.fb.group({
          title: [element.title, [Validators.required]],
          shortDescription: [element.shortDescription, Validators.required],
          value: [''],
          imageUrl: [element.imageUrl],
          cost: [element.cost, [Validators.required]],
          isMultiple: true,
        })
      );
    });
  }

  initVariationForm(): void {
    this.newVariationForm = this.fb.group({
      name: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
    });
  }

  createNewVariation() {
    this.creatingVariation = true;
    this.selectedCategoryId = this.newVariationForm.value.categoryId;
    this.productService.createVariation(this.newVariationForm.value).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.document.getElementById('closeVariationModalBtn').click();
          this.creatingVariation = false;
          this.toast.success(res.message);
          this.getVariations(this.selectedCategoryId);
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
      cost: [null, [Validators.required]],
      shortDescription: [''],
      imageUrl: [''],
      isMultiple: false,
    });
  }

  addVariation(): void {
    this.addingVariation = true;
    this.variations().push(this.createVariation());
  }

  removeVariation(index: number): void {
    if (index === 0) {
      this.addingVariation = false;
    }
    this.variations().removeAt(index);
  }

  options(): FormArray {
    return this.form.get('options') as FormArray;
  }

  createOptions(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      shortDescription: ['', Validators.required],
      value: [''],
      imageUrl: [null],
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

  addProductOption(): void {
    this.addingComplimentaryOptions = true;
    this.options().push(this.createOptions());
  }

  removeOption(index: number): void {
    this.complementaryImagesStore = JSON.parse(
      localStorage.getItem('compImagesStore')
    );
    if (this.complementaryImagesStore === null) {
      this.options().removeAt(index);
      this.complementaryImagesStore = [];
    } else {
      if (this.complementaryImagesStore.length === 1) {
        this.complementaryImagesStore.splice(index, 1);
        localStorage.removeItem('compImagesStore');
        this.addingComplimentaryOptions = false;
        this.options().removeAt(index);
      }
      if (this.complementaryImagesStore.length > 1) {
        this.complementaryImagesStore.splice(index, 1);
        localStorage.setItem(
          'compImagesStore',
          JSON.stringify(this.complementaryImagesStore)
        );
        this.options().removeAt(index);
      }
    }
  }

  upload(): void {
    this.uploadWidget.open();
  }

  removeImage(image_url): void {
    this.images = this.images.filter((a) => a !== image_url);
    this.form.patchValue({ imageUrls: this.images });
    this.productImage = this.images[0];
    if (this.images.length === 0) {
      this.productImage = null;
    }
  }

  uploadComplimentaryImage(index: any): void {
    this.complimentaryIndex = index;
    this.uploadComplimentaryWidget.open();
  }

  removeComplimentaryImage(id: any): void {
    for (let index = 0; index < this.form.value.options.length; index++) {
      const element = this.form.value.options[index];
      if (index === id) {
        element.imageUrl = '';
      }
    }
  }

  getSubCategories(id: any) {
    this.subCategories = [];
    this.form.value.categoryId = '';
    this.loadingSubCategories = true;
    this.selectedCategoryId = id;
    this.getVariations(id);
    this.newVariationForm.patchValue({ categoryId: this.selectedCategoryId });
    this.productService.getSubCategories(id).subscribe(
      (res) => {
        this.subCategories = res.data;
        this.getVariations(id);
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

  getVariations(categoryId?: any) {
    this.productService.getVariations(categoryId).subscribe(
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
    if (this.isSubCatIdEmpty === true) {
      this.form.patchValue({ categoryId: '' });
    }
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
      .updateProduct(this.form.value, this.productId)
      .subscribe(
        (res) => {
          if (res.status === 'success') {
            this.toast.success(res.message);
            this.router.navigate(['/seller/products']);
            this.creatingProduct = false;
            localStorage.removeItem('compImagesStore');
            this.complementaryImagesStore = [];
          } else {
            this.creatingProduct = false;
            this.toast.error(res.message);
          }
        },
        (err) => {
          this.creatingProduct = false;
          this.toast.error(err.message);
        }
      );
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
    this.productService.createNewProduct(this.form.value).subscribe(
      (res) => {
        if (res.status === 'success') {
          this.toast.success(res.message);
          this.router.navigate(['/seller/products']);
          this.creatingProduct = false;
          localStorage.removeItem('compImagesStore');
          this.complementaryImagesStore = [];
        } else {
          this.creatingProduct = false;
          this.toast.error(res.message);
        }
      },
      (err) => {
        this.creatingProduct = false;
        this.toast.error(err.message);
      }
    );
  };
  isSubCatIdEmpty = false;
  onSubmit = () => {
    if (this.images.length < 1) {
      this.toast.error('Product Image(s) required');
      return;
    }
    if (this.images.length < 1) {
      this.toast.error('Product Image(s) required');
      return;
    }
    if (this.form.value.description === '') {
      this.toast.error('Enter Product Description to Procees');
      return;
    }
    if (
      this.form.value.category !== '' &&
      this.subCategories.length > 0 &&
      this.form.value.categoryId === ''
    ) {
      this.toast.error('Select a Sub Category');
      return;
    }
    if (this.subCategories.length === 0 && this.form.value.category !== '') {
      this.isSubCatIdEmpty = true;
      this.form.patchValue({ categoryId: this.form.value.category });
    }
    if (this.form.valid) {
      this.setComplementaryProducts();
      this.form.patchValue({ imageUrl: this.form.value.imageUrls[0] });
      this.setVariation(this.form.value.variations);
      this.previewImg = this.form.value.imageUrls[0];
      console.log('description', this.form.value.description);
      this.previewData = this.form.value;
      this.isPreview = true;
    }
  };

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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
