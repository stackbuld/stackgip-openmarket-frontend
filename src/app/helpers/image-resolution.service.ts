import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ImageResolutionService {

  constructor() { }

  getImageResolution(url: string, width: any, height: any) {
    return `https://res.cloudinary.com/votel/image/fetch/c_fill,g_auto,h_500,w_650/b_auto:border,c_pad,h_${height},w_${width}/q_auto:best/${url}`
  }
}
