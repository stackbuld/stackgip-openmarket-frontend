import { Injectable } from '@angular/core';
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {

  constructor() { }

  getDecodedAccessToken(token: string): any {
      return jwtDecode(token);
  }

}
