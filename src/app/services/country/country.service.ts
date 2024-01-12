import { Injectable } from '@angular/core';

import { ApiAppUrlService } from '../api-app-url.service';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import {
  CountryInfo,
  HttpCountryInfoResponse,
  RawCountryInfo,
} from 'src/app/models/country.model';

@Injectable({ providedIn: 'root' })
export class CountryService {
  constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {}

  getCountry() {
    return this.http
      .get<HttpCountryInfoResponse>(
        this.apiUrls.ecommerceBaseUrl + 'products/countries'
      )
      .pipe(
        map((res) => {
          return res.data.map((item) => {
            return {
              alpha2Code: item.alpha2Code,
              alpha3Code: item.alpha3Code,
              phoneCode: item.phoneCode,
              countryName: item.name,
              flag: item.flag,
            };
          });
        }),
        tap((res) => {
          localStorage.setItem('countryCodesInfo', JSON.stringify(res));
        })
      );
  }
}
