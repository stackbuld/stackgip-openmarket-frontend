import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }
  getClientErrorMessage(error: Error): string {
    return error.message ?
           error.message :
           error.toString();
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ?
           error.message :
           'No Internet Connection';
  }

  getControlError(controls):string[]{
    let errs:string[] = [];
    for(const name in controls){
        if(controls[name].hasError('required')){
          errs.push(name+',');
        }
    }
    const lastIndex:number = errs.length - 1;
    if(lastIndex > -1){
      errs[lastIndex] = errs[lastIndex].replace(',','');
      if(errs.length > 1){
        errs[lastIndex - 1] = errs[lastIndex - 1].replace(',','');
        errs[lastIndex] = 'and '+errs[lastIndex];
      } 
    }
    return errs;
  }
}
