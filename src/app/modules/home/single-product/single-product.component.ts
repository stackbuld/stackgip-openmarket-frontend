import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { ImageResolutionService } from 'src/app/helpers/image-resolution.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit{
  currentImgUrl = '';
  activeImgId = 0;
  isInformation = true;
  products: any[] = [];
  addresses: any[] = [];
  imgUrls: any[] = [];
  count = 1;
  productId = null;
  product = null;
  loading: boolean;
  allVariationsList: any[] = [];
  sortedVariationsList: any[] = [];
  selectedVariations: any[] = [];
  selectedComplementaryProducts: any[] = [];
  complimentaryProductsList: any[] = [];
  addressForm: FormGroup;
  user = null;
  loadingAddress: boolean;
  addingItemToCart: boolean;
  currentAddress = null;
  selectedAddress: any;
  selectedShippingMethod: any;
  shippingMethods: any[] = [];
  currentShippingMethod = null;
  deletingAddress: boolean;
  loadingShippingEstimate: boolean;
  deleteId: any;
  referenceId = null;
  cart: null;
  productPrice = 0;
  isEditAddress = false;
  notReady = true;
  setter = 'Please type in your address';
  temporaryDetails = null;

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  options = {
    types: ['address'],
    componentRestrictions: { country: 'NG' },
  };

  constructor(
    private toastService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,
    private userService: UserService,
    private router: Router,
    private applocal: AppLocalStorage,
    public imageResolutionService: ImageResolutionService,
  ) { }

  ngOnInit(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    this.applocal.messageSource.subscribe(res => {
      if(res) {
        this.temporaryDetails = res;
        this.applocal.storeToStorage('temporaryDetails', res);
      } else {
        this.temporaryDetails = this.applocal.getFromStorage('temporaryDetails');
      }
    })

    if(localStorage.getItem('referenceId') === null) {
      this.referenceId = this.generateRandomString(10);
    } else {
      this.referenceId = localStorage.getItem('referenceId');
    }
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getParams();
    if (localStorage.getItem('shippingAddress')) {
      let address = JSON.parse(localStorage.getItem('shippingAddress'));
      // let address = this.applocal.getFromStorage('shippingAddress');
      this.currentAddress = address;
      this.populateAddressForm(address);
      this.getShippingEstimate();
    } else {
      this.initAddressForm();
    }
  }

//   {
//     "firstname": "Kehinde",
//     "lastname": "Onyekuwuluje",
//     "fullAddress": "Ikeja General Hospital Road, Ikeja GRA 101233, Lagos, Nigeria",
//     "lat": 6.5910288,
//     "lng": 3.3423427,
//     "city": "Ikeja",
//     "state": "Lagos",
//     "country": "NG",
//     "userId": null,
//     "contactPhoneNumber": "09034719389"
// }

  populateAddressForm = (data: any) => {
    this.setter = data.fullAddress;
    this.addressForm = new FormGroup({
      firstname: new FormControl(data.firstname, Validators.required),
      lastname: new FormControl(data.lastname, Validators.required),
      fullAddress: new FormControl(data.fullAddress),
      lat: new FormControl(data.lat),
      lng: new FormControl(data.lng),
      city: new FormControl(data.city),
      state: new FormControl(data.state),
      country: new FormControl(data.country),
      userId: new FormControl(null),
      contactPhoneNumber: new FormControl(data.contactPhoneNumber, Validators.required),
    });
  }

  initAddressForm = () => {
    this.addressForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      fullAddress: new FormControl(''),
      lat: new FormControl(''),
      lng: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      // isDefault: new FormControl(true),
      userId: new FormControl(null),
      contactPhoneNumber: new FormControl('', Validators.required),
    });
  }

  getImageResolution(url: string, width: any, height: any) {
    return `https://res.cloudinary.com/votel/image/fetch/c_fill,g_auto,h_500,w_650/b_auto:border,c_pad,h_${height},w_${width}/q_auto:best/${url}`
  }

  getParams = () => {
    this.activatedRoute.params.subscribe(params => {
      this.productId = params['id'];
      this.getProductDetails();
    });
  }

  getProductDetails = () => {
    this.loading = true;
    const productService$ = this.productService.getCachedProductById(this.productId);
    productService$.subscribe(res => {
      this.product = res.data;
      this.productPrice = res.data.price;
      this.currentImgUrl = res.data.productImages[0];
      for (let index = 0; index < this.product.productImages.length; index++) {
        const element = this.product.productImages[index];
        let item ={
          url: element,
          id: index
        }
        if(this.imgUrls.length !== 4) {
          this.imgUrls.push(item);
        }
      }
      for (let index = 0; index < res.data.productOptions.length; index++) {
        const element = res.data.productOptions[index];
        if (element.isMultiple === false) {
          element.isSelected = false;
          this.allVariationsList.push(element);
        }
        if (element.isMultiple === true) {
          element.isSelected = false;
          this.complimentaryProductsList.push(element);
        }
      }
      this.setVariation(this.allVariationsList);
      this.fetchAllProducts();
      this.fetchUserAddresses();
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

  setSelectedVariation = (item: any) => {
    const matchingItem = this.allVariationsList.find((element) => element.id === item.id);
  
    if (matchingItem) {
      const matchingIndex = this.selectedVariations.findIndex((selected) => selected.id === item.id);
      const matchingTitleIndex = this.selectedVariations.findIndex((selected) => selected.title === item.title);
  
      if (matchingIndex >= 0) { // item already in selectedVariations, remove it
        matchingItem.isSelected = false;
        this.selectedVariations.splice(matchingIndex, 1);
        this.productPrice = this.productPrice - matchingItem.cost;
      } else if (matchingTitleIndex >= 0) { // item not in selectedVariations but same title already exists, remove the old one and add the new one
        const oldItem = this.selectedVariations[matchingTitleIndex];
        this.productPrice = this.productPrice - oldItem.cost;
        oldItem.isSelected = false;
        this.selectedVariations.splice(matchingTitleIndex, 1, matchingItem);
        this.productPrice = this.productPrice + matchingItem.cost;
        matchingItem.isSelected = true;
      } else { // item not in selectedVariations, add it
        matchingItem.isSelected = true;
        this.productPrice = this.productPrice + matchingItem.cost;
        this.selectedVariations.push(matchingItem);
      }
    }
  }
  
  // setSelectedVariation = (item: any) => {
  //   for (let index = 0; index < this.allVariationsList.length; index++) {
  //     const element = this.allVariationsList[index];
  //     if (element.id === item.id) {
  //       if (!element.isSelected) {
  //         element.isSelected = true;
  //         this.selectedVariations.push(element);
  //       } else {
  //         element.isSelected = false;
  //         this.selectedVariations = this.deleteSelectedItem(this.selectedVariations, element.id);
  //       }
  //     }
  //   }
  // }

  setSelectedComplementaryProduct = (item: any) => {
    for (let index = 0; index < this.complimentaryProductsList.length; index++) {
      const element = this.complimentaryProductsList[index];
      if (element.id === item.id) {
        if (!element.isSelected) {
          element.isSelected = true;
          this.selectedComplementaryProducts.push(element);
        } else {
          element.isSelected = false;
          this.selectedComplementaryProducts = this.deleteSelectedItem(this.selectedComplementaryProducts, element.id);
        }
      }
    }
  }

  deleteSelectedItem = (arr: {id: string}[], idToDelete: string): {id: string}[] => {
    const index = arr.findIndex(obj => obj.id === idToDelete);
    if (index === -1) return arr; // If object with the specified id not found, return the original array
    arr.splice(index, 1); // Remove the object at the specified index
    return arr; // Return the modified array
  };

  setVariation(list: any) {
    const groupedOptions = list.reduce((acc, option) => {
      const title = option.title;
      const existingOptions = acc[title] || [];
      return {
        ...acc,
        [title]: [...existingOptions, option],
      };
    }, {});
    const groupedOptionsArray = Object.values(groupedOptions);
    this.sortedVariationsList = groupedOptionsArray;
  }

  setImgUrl = (url: string, id: number) => {
    this.currentImgUrl = url;
    this.activeImgId = id;
  }

  preventLetter(evt: any): boolean {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  fetchAllProducts = () => {
    const productService$ = this.productService.getProducts(1, 10, '', this.product.categoryId, 1, 5000000);
    productService$.subscribe((products) => {
        this.products = products.data.data;
      }, error => {

    });
  }

  setSelectedShippingMethod = (item: any) => {
    this.selectedShippingMethod = item;
  }

  setShippingMethod = () => {
    this.currentShippingMethod = this.selectedShippingMethod;
    for (let index = 0; index < this.shippingMethods.length; index++) {
      const element = this.shippingMethods[index];
      element.isSelected = false;
      if (element.estimatePrices[0].startingPrice === this.currentShippingMethod.estimatePrices[0].startingPrice &&
        element.estimatePrices[0].logisticName === this.currentShippingMethod?.estimatePrices[0].logisticName && 
        element.estimatePrices[0].logisticLogoUrl === this.currentShippingMethod.estimatePrices[0].logisticLogoUrl) {
        element.isSelected = true;
      }
    }
    this.toastService.success('Shipping Method Updated', 'SUCCESS');
    document.getElementById('closeShippingMethodDialog').click();
  }
  
  setSelectedAddress = (item: any) => {
    this.selectedAddress = item;
  }

  setCurrentAddress = () => {
    this.currentShippingMethod = null;
    this.currentAddress = this.selectedAddress;
    for (let index = 0; index < this.addresses.length; index++) {
      const element = this.addresses[index];
      element.isSelected = false;
      if (element.id === this.currentAddress.id) {
        element.isSelected = true;
      }
    }
    this.toastService.success('Delivery Address Updated', 'SUCCESS');
    document.getElementById('closeAddressFormDialog').click();
    localStorage.removeItem('shippingAddress');
    this.populateAddressForm(this.currentAddress);
    this.getShippingEstimate();
  }

  setDefaultAddress = (address: any) => {
    delete address.createdOn;
    delete address.userId;
    address.isDefault = true;
    const userService$ = this.userService.setDefaultAddress(address, address.id);
    delete address.id;
    userService$.subscribe((res) => {
        if (res.sucess = true) {
          this.fetchUserAddresses();
          this.toastService.success(res.message, 'SUCCESS');
        } else {
          this.toastService.error(res.message, 'ERROR');
        }
      }, error => {
        this.toastService.error(error.message, 'ERROR');
    });
  }
  
  deleteAddress = (id: any) => {
    this.deleteId = id;
    this.deletingAddress = true;
    const userService$ = this.userService.deleteAddress(id);
    userService$.subscribe((res) => {
        if (res.sucess = true) {
          this.fetchUserAddresses();
          this.toastService.success(res.message, 'SUCCESS');
          this.deletingAddress = false;
        } else {
          this.toastService.error(res.message, 'ERROR');
          this.deletingAddress = false;
        }
      }, error => {
        this.toastService.error(error.message, 'ERROR');
        this.deletingAddress = false;
    });
  }

  fetchUserAddresses = () => {
    if (this.user !== null) {
      const userService$ = this.userService.fetchUserAddresses(this.user.id);
      userService$.subscribe((res) => {
          this.addresses = res.data.data;
          if (this.addresses.length > 0) {
            for (let index = 0; index < this.addresses.length; index++) {
              const element = this.addresses[index];
              element.isSelected = false;
              if (!localStorage.getItem('shippingAddress')) {
                if (element.isDefault) {
                  this.currentAddress = element;
                  element.isSelected = true;
                }
              }
            }
          } else {
            this.currentAddress = null;
          }
          this.getShippingEstimate();
        }, error => {

      });
    } else {
      this.addresses = [];
    }
  }

  getShippingEstimate = () => {
    this.loadingShippingEstimate = true;
    const payload = {
      productId: this.productId,
      userAddress: {
        customerPhoneNumber: this.currentAddress.contactPhoneNumber,
        firstName: this.currentAddress.firstname,
        lastName: this.currentAddress.lastname,
        fullAddress: this.currentAddress.fullAddress,
        streetName: this.currentAddress.fullAddress,
        state: this.currentAddress.state,
        city: this.currentAddress.city,
        town: this.currentAddress.city,
        countryCode: this.currentAddress.country,
        lga: "",
        zipCode: "",
        lat: this.currentAddress.lat,
        lng: this.currentAddress.lng,
      }
    }
    const userService$ = this.userService.getShippingEstimate(payload);
    userService$.subscribe((res) => {
        this.loadingShippingEstimate = false;
        this.shippingMethods = res.data;
        if (this.currentShippingMethod === null) {
          let priceList = [];
          let lowestPrice: any;
          this.shippingMethods.forEach(element => {
            priceList.push(element.estimatePrices[0]?.startingPrice)
          });
          lowestPrice = Math.min(...priceList);
          for (let index = 0; index < this.shippingMethods.length; index++) {
            const element = this.shippingMethods[index];
            element.isSelected = false;
            if (element.estimatePrices[0]?.startingPrice === lowestPrice) {
              // element.isSelected = true;
              // this.currentShippingMethod = element;
              this.selectedShippingMethod = element;
              this.currentShippingMethod = element;
              for (let index = 0; index < this.shippingMethods.length; index++) {
                const element = this.shippingMethods[index];
                element.isSelected = false;
                if (element.estimatePrices[0].startingPrice === this.currentShippingMethod.estimatePrices[0].startingPrice &&
                  element.estimatePrices[0].logisticName === this.currentShippingMethod?.estimatePrices[0].logisticName && 
                  element.estimatePrices[0].logisticLogoUrl === this.currentShippingMethod.estimatePrices[0].logisticLogoUrl) {
                  element.isSelected = true;
                }
              }
            }
          }
        }
      }, error => {
        this.loadingShippingEstimate = false;
    });
  }

  public handleAddressChange(address: Address) {
    let country = address.address_components.filter((element) => {
      return element.types.includes('country');
    });
    let city = address.address_components.filter((element) => {
      return element.types.includes('administrative_area_level_2');
    });
    let state = address.address_components.filter((element) => {
      return element.types.includes('administrative_area_level_1');
    });
    let landmark = address.address_components.filter((element) => {
      return element.types.includes('locality');
    });
    let postalCode = address.address_components.filter((element) => {
      return element.types.includes('postal_code');
    });
    let streetName = address.address_components.filter((element) => {
      return element.types.includes('route');
    });

    this.addressForm.patchValue({fullAddress: address.formatted_address});
    this.addressForm.patchValue({lng: address.geometry.location.lng()});
    this.addressForm.patchValue({lat: address.geometry.location.lat()});
    this.addressForm.patchValue({country: country[0].short_name});
    this.addressForm.patchValue({city: city[0].long_name});
    this.addressForm.patchValue({state: state[0].long_name});
    // this.landmark.patchValue(landmark[0].long_name);
    // this.postalCode.patchValue(postalCode[0].long_name);
    // this.streetName.patchValue(streetName[0].long_name);
  }

  applyAddress = () => {
    if (this.addressForm.value.fullAddress !== '') {
      this.loadingAddress = true;
      this.setter = this.addressForm.value.fullAddress;
      if (this.user !== null) {
        this.addressForm.patchValue({userId: this.user.id});
        const userService$ = this.userService.createAddress(this.addressForm.value);
        userService$.subscribe(res => {
          if (res.status === 'success') {
            this.toastService.success('Address created successfully', 'SUCCESS');
            this.fetchUserAddresses();
            this.loadingAddress = false;
            document.getElementById('closeAddressFormDialog').click();
            this.initAddressForm();
          } else {
            this.loadingAddress = false;
            this.toastService.error(res.message, 'ERROR');
          }
        }, err => {
          this.loadingAddress = false;
          this.toastService.error(err.message, 'ERROR');
        })
      } else {
        this.loadingAddress = false;
        localStorage.setItem('shippingAddress', JSON.stringify(this.addressForm.value));
        this.currentAddress = this.addressForm.value;
        this.getShippingEstimate();
        this.toastService.success('Address saved', 'SUCCESS');
        document.getElementById('closeAddressFormDialog').click();
      }
    } else {
      this.toastService.warning('Address field is required', 'WARNING');
    }
  }

  increaseQuantity = () => {
    this.count++;
  }

  decreaseQuantity = () => {
    if(this.count > 1) {
      this.count--
    }
  }

  toggleModalView = () => {
    if(this.user !== null) {
      this.isInformation = false;
    } else {
      this.toastService.warning('Please login to view addresses', 'WARNING');
    }
  }

  viewExtraProduct = (id: any) => {
    // this.router.navigate([`/homepage/product/${id}`]);
  }

  resetModalView = () => {
    this.isInformation = true;
  }

  setAddressField = () => {
    this.notReady = false;
  }

  openAddressModal = () => {
    this.resetModalView();
    if (this.currentAddress !== null) {
      this.isEditAddress = true;
    }
    const element = document.getElementById('openAddressModalBtn');
    element.click();
  }

  generateRandomString(length: number): string {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  addToCart = () => {
    if (this.currentAddress === null) {
      const element = document.getElementById('openAddressModalBtn');
      element.click();
    } else if (this.currentShippingMethod === null) {
      document.getElementById('openShippingModalBtn').click();
    } else {
      this.addingItemToCart = true;
      const payload = {
        userId: this.user ? this.user.id : '',
        referenceId: this.referenceId,
        currencyCode: "NGN",
        item: {
          currencyCode: "NGN",
          productId: this.productId,
          unit: this.count,
          logisticCode: this.currentShippingMethod.logisticCode,
          logistic: {
            logisticId: this.currentShippingMethod.logisticCode,
            logisticCode: this.currentShippingMethod.logisticCode,
            logisticLogo: this.currentShippingMethod.estimatePrices[0].logisticLogoUrl,
            logisticName: this.currentShippingMethod.estimatePrices[0].logisticName,
            estimateShippingCost: this.currentShippingMethod.estimatePrices[0].startingPrice,
          },
          paymentOption: "online",
          destination: {
            firstname: this.currentAddress.firstname,
            lastname: this.currentAddress.lastname,
            lat: this.currentAddress.lat,
            lng: this.currentAddress.lng,
            country: this.currentAddress.country,
            city: this.currentAddress.city,
            state: this.currentAddress.state,
            address: this.currentAddress.fullAddress,
            phoneNumber: this.currentAddress.contactPhoneNumber,
          },
          selectedVarationIds: this.selectedVariations.map(it => it.id),
          selectedComplementaryProductId: this.selectedComplementaryProducts.map(it => it.id),
        }
      }
      localStorage.setItem('referenceId', payload.referenceId);
      const productService$ = this.productService.addToCart(payload);
      productService$.subscribe((res) => {
          if (res.status === 'success') {
            this.addingItemToCart = false;
            this.toastService.success('Item successfully added to cart', 'SUCCESS');
            this.getCustomerCart();
          } else {
            this.addingItemToCart = false;
            this.toastService.error(res.message, 'ERROR');
          }
      }, error => {
        this.addingItemToCart = false;
        this.toastService.error(error.message, 'ERROR');
      });
    }
  }

  getCustomerCart = () => {
    let productService$;
    if (this.user !== null) {
      const payload = {
        key: 'user',
        id: this.user.id
      }
      productService$ = this.productService.getCart(payload);
    } else {
      const payload = {
        key: 'reference',
        id: this.referenceId
      }
      productService$ = this.productService.getCart(payload);
    }
    productService$.subscribe((res) => {
        if (res.status === 'success') {
          this.cart = res.data;
          this.applocal.cartCount.next(res.data.cartItems.length + 1);
          this.applocal.storeToStorage('cartCount', res.data.cartItems.length + 1);
        } else {
          this.toastService.warning(res.message, 'MESSAGE')
        }
      }, (error) => {
        this.toastService.error(error.message, 'ERROR')
    });
  }
}
