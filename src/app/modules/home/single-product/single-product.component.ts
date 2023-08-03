import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products/products.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { AppLocalStorage } from 'src/app/helpers/local-storage';
import { ImageResolutionUtility } from 'src/app/helpers/image-resolution.utility';
import { AuthService } from 'src/app/services/auth.service';import { IUser } from '../../../models/IUserModel';
import { CartService } from '../../../services/cart/cart.service';
import {CartAddress} from '../../../models/StoreModels';
import {WebsocketService} from '../../../services/websocket';
import {AddToCartRequestModel} from '../../../services/cart/model/add-cart-model';
import {
  GetShippingEstimatePrice,
  GetShippingPriceEstimateData,
  GetShippingPriceEstimateRequest
} from '../../../services/cart/model/logistic.model';
import {NotificationResponseModel} from '../../../models/notificationResponse.model';
import * as lodash  from 'lodash';
import {forEach} from 'lodash';
import * as cryptoJs from 'crypto-js';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss'],
})
export class SingleProductComponent implements OnInit {
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
  user: IUser;
  loadingAddress: boolean;
  addingItemToCart: boolean;
  currentAddress: CartAddress = null;
  selectedAddress: any;
  selectedShippingMethod: GetShippingEstimatePrice;
  shippingMethods: GetShippingEstimatePrice[] = [];
  currentShippingMethod : GetShippingEstimatePrice = null;
  deletingAddress: boolean;
  loadingShippingEstimate: boolean;
  loadingShippingStatus : 'not_started'|'in_progress'| 'completed' = 'not_started';
  deleteId: any;
  referenceId = '';
  cart: null;
  productPrice = 0;
  isEditAddress = false;
  notReady = true;
  setter = 'Please type in your address';
  temporaryDetails = null;

  requestId = '';
  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  options = {
    types: ['address'],
    componentRestrictions: { country: 'NG' },
  };

  constructor(
    private toastService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService,

    private cartService: CartService,
    private userService: UserService,
    private router: Router,
    private applocal: AppLocalStorage,
    private authService: AuthService,
    private webSocketService: WebsocketService,
  ) {
    this.initAddressForm();
  }

  async ngOnInit() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    await this.connectToWebsocket();
    this.applocal.messageSource.subscribe((res) => {
      if (res) {
        this.temporaryDetails = res;
        this.applocal.storeToStorage('temporaryDetails', res);
      } else {
        this.temporaryDetails =
          this.applocal.getFromStorage('temporaryDetails');
      }
    });
     this.referenceId  = this.authService.getUserReferenceNumber();
    // this.user = JSON.parse(localStorage.getItem('user') as string) as IUser;
    this.applocal.currentUser.subscribe((res) => {
      if (res) {
        this.user = res as IUser;
        this.fetchUserAddresses();
      } else {
        this.user = JSON.parse(localStorage.getItem('user') as string) as IUser;
      }
    });
    this.getParams();

    if (localStorage.getItem('shippingAddress')) {
      const address = JSON.parse(
        localStorage.getItem('shippingAddress') as string
      );
      this.currentAddress = address;
      this.setRequestId();
      this.populateAddressForm(address);
      this.getShippingEstimate();
    }
  }

  setRequestId = () => {
    const toHash = cryptoJs.MD5(this.currentAddress?.fullAddress);
    this.requestId = `view-product-page-${this.productId}:${this.authService.getUserReferenceNumber()}:${toHash}`
  }

  async connectToWebsocket(){
   const url =  await this.authService.getWebSocketUrl();
   this.webSocketService.getSocket(url).subscribe(a=> {
      this.processRealTimeShippingPrice(a);
   });
  }
  processRealTimeShippingPrice(notificationResponse: NotificationResponseModel){
    if(notificationResponse.requestId === this.requestId){
      if(notificationResponse.notificationType === 'GET_LOGISTIC_PRICES_COMPLETED'){
        this.loadingShippingEstimate = false;
        this.loadingShippingStatus = 'completed';

        const shippingData = notificationResponse.data as  GetShippingPriceEstimateData[];
        const shippingEsitmateData = shippingData.flatMap(a=>a.estimatePrices);
        const hasSelected = this.shippingMethods.some(a=>a.isSelected);
        if(hasSelected){
          for (const shipping of shippingEsitmateData) {
            if(shipping.logisticCode === this.currentShippingMethod?.logisticCode){
               shipping.isSelected =  this.currentShippingMethod?.isSelected;
            }
          }
        }
        this.shippingMethods = shippingEsitmateData;
        this.orderAndSelectDefaultShippingMethod();
      }else if(notificationResponse.notificationType === 'GET_LOGISTIC_PRICES'){
        this.loadingShippingEstimate = true;
        this.loadingShippingStatus = 'in_progress';
        const data = notificationResponse.data as GetShippingEstimatePrice;
        const findExisting =  this.shippingMethods
          .find(a=>a.logisticCode === data.logisticCode);
        if(findExisting){
          data.isSelected = findExisting.isSelected;
          lodash.remove(this.shippingMethods, a=> a.logisticCode === findExisting.logisticCode);
          this.shippingMethods.push(data);
        }else {
          this.shippingMethods.push(data)
        }
        this.orderAndSelectDefaultShippingMethod();
      }
    }

  }
  getImageResolution = (url: string, width: number, height: number) => {
    return ImageResolutionUtility.getImageResolution(url, width, height);
  };

  viewProduct = (id: any) => {
    this.router.navigate(['/homepage/product', id]);
    this.getShippingEstimate();
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

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
      contactPhoneNumber: new FormControl(
        data.contactPhoneNumber,
        Validators.required
      ),
    });
  };

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
  };

  getParams = () => {
    this.activatedRoute.params.subscribe((params) => {
      this.productId = params.id;
      this.getProductDetails();
    });
  };

  getProductDetails = () => {
    this.loading = true;
    const productService$ = this.productService.getCachedProductById(
      this.productId
    );
    productService$.subscribe(
      (res) => {
        this.product = res.data;
        this.productPrice = res.data.price;
        this.currentImgUrl = res.data.productImages[0];
        for (
          let index = 0;
          index < this.product.productImages.length;
          index++
        ) {
          const element = this.product.productImages[index];
          const item = {
            url: element,
            id: index,
          };
          if (this.imgUrls.length !== 4) {
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
      },
      (err) => {
        this.loading = false;
      }
    );
  };

  setSelectedVariation = (item: any) => {
    const matchingItem = this.allVariationsList.find(
      (element) => element.id === item.id
    );

    if (matchingItem) {
      const matchingIndex = this.selectedVariations.findIndex(
        (selected) => selected.id === item.id
      );
      const matchingTitleIndex = this.selectedVariations.findIndex(
        (selected) => selected.title === item.title
      );

      if (matchingIndex >= 0) {
        // item already in selectedVariations, remove it
        matchingItem.isSelected = false;
        this.selectedVariations.splice(matchingIndex, 1);
        this.productPrice = this.productPrice - matchingItem.cost;
      } else if (matchingTitleIndex >= 0) {
        // item not in selectedVariations but same title already exists, remove the old one and add the new one
        const oldItem = this.selectedVariations[matchingTitleIndex];
        this.productPrice = this.productPrice - oldItem.cost;
        oldItem.isSelected = false;
        this.selectedVariations.splice(matchingTitleIndex, 1, matchingItem);
        this.productPrice = this.productPrice + matchingItem.cost;
        matchingItem.isSelected = true;
      } else {
        // item not in selectedVariations, add it
        matchingItem.isSelected = true;
        this.productPrice = this.productPrice + matchingItem.cost;
        this.selectedVariations.push(matchingItem);
      }
    }
  };

  setSelectedComplementaryProduct = (item: any) => {
    for (
      let index = 0;
      index < this.complimentaryProductsList.length;
      index++
    ) {
      const element = this.complimentaryProductsList[index];
      if (element.id === item.id) {
        if (!element.isSelected) {
          element.isSelected = true;
          this.selectedComplementaryProducts.push(element);
        } else {
          element.isSelected = false;
          this.selectedComplementaryProducts = this.deleteSelectedItem(
            this.selectedComplementaryProducts,
            element.id
          );
        }
      }
    }
  };

  deleteSelectedItem = (
    arr: { id: string }[],
    idToDelete: string
  ): { id: string }[] => {
    const index = arr.findIndex((obj) => obj.id === idToDelete);
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
  };

  preventLetter(evt: any): boolean {
    const charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  }

  fetchAllProducts = () => {
    const productService$ = this.productService.getProducts(
      1,
      10,
      '',
      this.product.categoryId,
      1,
      5000000
    );
    productService$.subscribe(
      (products) => {
        this.products = products.data.data;
      },
      (error) => {}
    );
  };

  setSelectedShippingMethod = (item: GetShippingEstimatePrice) => {
    this.selectedShippingMethod = item;
  };

  setShippingMethod = () => {
    this.currentShippingMethod = this.selectedShippingMethod;
    for (let index = 0; index < this.shippingMethods.length; index++) {
      const element = this.shippingMethods[index];
      element.isSelected = false;
      if (
        element.startingPrice ===
          this.currentShippingMethod.startingPrice &&
        element.logisticName ===
          this.currentShippingMethod?.logisticName &&
        element.logisticLogoUrl ===
          this.currentShippingMethod.logisticLogoUrl
      ) {
        element.isSelected = true;
      }
    }
    this.toastService.success('Shipping Method Updated', 'SUCCESS');
    document.getElementById('closeShippingMethodDialog').click();
  };

  setSelectedAddress = (item: any) => {
    this.selectedAddress = item;
  };

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
  };

  setDefaultAddress = (address: any) => {
    delete address.createdOn;
    delete address.userId;
    address.isDefault = true;
    const cartService$ = this.cartService.setDefaultAddress(
      address,
      address.id
    );
    delete address.id;
    cartService$.subscribe(
      (res) => {
        if ((res.sucess = true)) {
          this.fetchUserAddresses();
          this.toastService.success(res.message, 'SUCCESS');
        } else {
          this.toastService.error(res.message, 'ERROR');
        }
      },
      (error) => {
        this.toastService.error(error.message, 'ERROR');
      }
    );
  };

  deleteAddress = (id: any) => {
    this.deleteId = id;
    this.deletingAddress = true;
    const cartService$ = this.cartService.deleteAddress(id);
    cartService$.subscribe(
      (res) => {
        if ((res.sucess = true)) {
          this.fetchUserAddresses();
          this.toastService.success(res.message, 'SUCCESS');
          this.deletingAddress = false;
        } else {
          this.toastService.error(res.message, 'ERROR');
          this.deletingAddress = false;
        }
      },
      (error) => {
        this.toastService.error(error.message, 'ERROR');
        this.deletingAddress = false;
      }
    );
  };

  fetchUserAddresses = () => {
    if (this.user !== null) {
      const cartService$ = this.cartService.fetchUserAddresses(this.user.id);
      cartService$.subscribe(
        (res) => {
          this.addresses = res.data.data;
          const storedAddress = localStorage.getItem('shippingAddress');
          if (storedAddress) {
            const parsedStoredAddress = JSON.parse(storedAddress);
            this.addresses.forEach((element) => {
              element.isSelected = false;
            });
            this.currentAddress = parsedStoredAddress;
            const selectedAddressIndex = this.addresses.findIndex(
              (address) => address.id === this.currentAddress.id
            );

            if (selectedAddressIndex !== -1) {
              this.addresses[selectedAddressIndex].isSelected = true;
            }
          } else {
            let defaultAddressFound = false;
            for (let index = 0; index < this.addresses.length; index++) {
              const element = this.addresses[index];
              element.isSelected = false;
              if (element.isDefault) {
                this.currentAddress = element;
                element.isSelected = true;
                defaultAddressFound = true;
                this.getShippingEstimate();
                // loadingShippingEstimate && currentShippingMethod === null
              }
            }
            if (!defaultAddressFound) {
              this.currentAddress = null;
            }
          }
          this.addresses.forEach((address) => {
            if (address.id !== this.currentAddress?.id) {
              address.isSelected = false;
            }
          });
          this.setRequestId();
          this.getShippingEstimate();
        },
        (error) => {}
      );
    } else {
      this.addresses = [];
    }
  };


  getShippingEstimate = () => {
    this.setRequestId();
    this.loadingShippingEstimate = true;
    const payload = {
      productId: this.productId,
      userId: this.authService.getLoggedInUser()?.id ?? '',
      referenceId: this.authService.getUserReferenceNumber(),
      requestId: this.requestId,
      userAddress: {
        customerPhoneNumber: this.currentAddress?.contactPhoneNumber,
        firstName: this.currentAddress?.firstname,
        lastName: this.currentAddress?.lastname,
        fullAddress: this.currentAddress?.fullAddress,
        streetName: this.currentAddress?.fullAddress,
        state: this.currentAddress?.state,
        city: this.currentAddress?.city,
        town: this.currentAddress?.city,
        countryCode: this.currentAddress?.country,
        lga: '',
        zipCode: '',
        lat: this.currentAddress?.lat,
        lng: this.currentAddress?.lng,
      } ,
    } as GetShippingPriceEstimateRequest;
    const cartService$ = this.cartService.getShippingEstimate(payload);
    cartService$.subscribe(
      (res) => {
        this.loadingShippingEstimate = false;
        this.shippingMethods = (res.data as GetShippingPriceEstimateData[]).flatMap(a=>a.estimatePrices) ;
        this.loadingShippingStatus = 'in_progress';
        // if (this.currentShippingMethod === null) {
        //   this.orderAndSelectDefaultShippingMethod();
        // }
        this.connectToWebsocket();
      },
      (error) => {
        this.loadingShippingEstimate = false;
      }
    );
  };

  orderAndSelectDefaultShippingMethod(){
    this.shippingMethods.sort((a, b) => a.startingPrice - b.startingPrice);
    const hasSelected = this.shippingMethods.some(a=>a.isSelected);
    if(!hasSelected){
      if(this.shippingMethods[0]){
        this.shippingMethods[0].isSelected = true;
        this.currentShippingMethod = this.shippingMethods[0];
        this.selectedShippingMethod = this.shippingMethods[0];
      }
    };
  }

  public handleAddressChange(address: Address) {
    const country = address.address_components.filter((element) => {
      return element.types.includes('country');
    });
    const city = address.address_components.filter((element) => {
      return element.types.includes('administrative_area_level_2');
    });
    const state = address.address_components.filter((element) => {
      return element.types.includes('administrative_area_level_1');
    });
    const landmark = address.address_components.filter((element) => {
      return element.types.includes('locality');
    });
    const postalCode = address.address_components.filter((element) => {
      return element.types.includes('postal_code');
    });
    const streetName = address.address_components.filter((element) => {
      return element.types.includes('route');
    });

    this.addressForm.patchValue({ fullAddress: address.formatted_address });
    this.addressForm.patchValue({ lng: address.geometry.location.lng() });
    this.addressForm.patchValue({ lat: address.geometry.location.lat() });
    this.addressForm.patchValue({ country: country[0].short_name });
    this.addressForm.patchValue({ city: city[0].long_name });
    this.addressForm.patchValue({ state: state[0].long_name });
    // this.landmark.patchValue(landmark[0].long_name);
    // this.postalCode.patchValue(postalCode[0].long_name);
    // this.streetName.patchValue(streetName[0].long_name);
  }

  applyAddress = () => {
    if (this.addressForm.value.fullAddress !== '') {
      this.loadingAddress = true;
      this.setter = this.addressForm.value.fullAddress;
      if (this.user !== null) {
        this.addressForm.patchValue({ userId: this.user.id });
        const cartService$ = this.cartService.createAddress(
          this.addressForm.value
        );
        cartService$.subscribe(
          (res) => {
            if (res.status === 'success') {
              this.toastService.success(
                'Address created successfully',
                'SUCCESS'
              );
              this.fetchUserAddresses();
              this.loadingAddress = false;
              document.getElementById('closeAddressFormDialog').click();
              this.initAddressForm();
            } else {
              this.loadingAddress = false;
              this.toastService.error(res.message, 'ERROR');
            }
          },
          (err) => {
            this.loadingAddress = false;
            this.toastService.error(err.message, 'ERROR');
          }
        );
      } else {
        this.loadingAddress = false;
        localStorage.setItem(
          'shippingAddress',
          JSON.stringify(this.addressForm.value)
        );
        this.currentAddress = this.addressForm.value;
        this.getShippingEstimate();
        this.toastService.success('Address saved!', 'SUCCESS');
        document.getElementById('closeAddressFormDialog').click();
      }
    } else {
      this.toastService.warning('Address field is required', 'WARNING');
    }
  };

  increaseQuantity = () => {
    this.count++;
  };

  decreaseQuantity = () => {
    if (this.count > 1) {
      this.count--;
    }
  };
  toggleSocialModal = () => {
    // if(this.user !== null) {
    //   this.isSocialModal = false;
    // }
    this.authService.showSharedSocialModal();
  }
  toggleLoginModal = () => {
    this.authService.showSharedLoginModal();
  };
  toggleSignupModal = () => {
    this.authService.showSharedSignupModal();
  };

  toggleModalView = () => {
    if (this.user !== null) {
      this.isInformation = false;
    } else {
      this.toastService.warning('Please login to view addresses', 'WARNING');
    }
  };

  resetModalView = () => {
    this.isInformation = true;
  };

  setAddressField = () => {
    this.notReady = false;
  };

  openAddressModal = () => {
    if (this.currentAddress !== null) {
      this.isEditAddress = true;
    }
    if(this.user !== null) {
      this.isInformation = false;
    } else {
      // this.resetModalView();
      this.isInformation = true;
    }
    const element = document.getElementById('openAddressModalBtn');
    element.click();
  };

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
        currencyCode: 'NGN',
        item: {
          currencyCode: 'NGN',
          productId: this.productId,
          unit: this.count,
          logisticCode: this.currentShippingMethod.logisticCode,
          logistic: {
            logisticId: this.currentShippingMethod.logisticCode,
            logisticCode: this.currentShippingMethod.logisticCode,
            logisticLogo:
              this.currentShippingMethod.logisticLogoUrl,
            logisticName:
              this.currentShippingMethod.logisticName,
            estimateShippingCost:
              this.currentShippingMethod.startingPrice,
          },
          paymentOption: 'online',
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
          selectedVarationIds: this.selectedVariations.map((it) => it.id),
          selectedComplementaryProductId:
            this.selectedComplementaryProducts.map((it) => it.id),
        },
      } as AddToCartRequestModel;

      const productService$ = this.cartService.addToCart(payload);
      productService$.subscribe(
        (res) => {
          if (res.status === 'success') {
            this.addingItemToCart = false;
            this.toastService.success(
              'Item successfully added to cart',
              'SUCCESS'
            );
            this.getCustomerCart();
          } else {
            this.addingItemToCart = false;
            this.toastService.error(res.message, 'ERROR');
          }
        },
        (error) => {
          this.addingItemToCart = false;
          this.toastService.error(error.message, 'ERROR');
        }
      );
    }
  };

  getCustomerCart = () => {
    let cart$;
    if (this.user !== null) {
      const payload = {
        key: 'user',
        id: this.user.id,
      };
      cart$ = this.cartService.getCart(payload);
    } else {
      const payload = {
        key: 'reference',
        id: this.referenceId,
      };
      cart$ = this.cartService.getCart(payload);
    }
    cart$.subscribe(
      (res) => {
        if (res.status === 'success') {
          this.cart = res.data;
          this.applocal.cartCount.next(res.data.cartItems.length + 1);
          this.applocal.storeToStorage(
            'cartCount',
            res.data.cartItems.length + 1
          );
        } else {
          this.toastService.warning(res.message, 'MESSAGE');
        }
      },
      (error) => {
        this.toastService.error(error.message, 'ERROR');
      }
    );
  };
}
