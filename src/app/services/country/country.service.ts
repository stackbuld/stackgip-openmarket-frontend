import { Injectable } from '@angular/core';

import { ApiAppUrlService } from '../api-app-url.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { log } from 'console';
import {
  HttpCountryInfoResponse,
  RawCountryInfo,
} from 'src/app/models/country.model';
import { iteratee } from 'lodash';

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
              alpha2code: item.alpha2Code,
              phoneCode: item.phoneCode,
              countryName: item.name,
            };
          });
        })
      );
  }
}
