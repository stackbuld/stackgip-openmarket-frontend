import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CloudinaryApiResponseDto } from './cloudinary.dto';
declare var cloudinary: any;

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  http = inject(HttpClient);

  uploadImage(formData: FormData): Observable<CloudinaryApiResponseDto> {
    const headers = new HttpHeaders().set('x-external-api-request', 'true');
    return this.http.post<CloudinaryApiResponseDto>(
      `https://api.cloudinary.com/v1_1/${environment.cloudinaryName}/image/upload`,
      formData,
      { headers: headers }
    );
  }

  uploadImageWithWidget(): any {
    cloudinary?.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        clientAllowedFormats: ['jpeg', 'jpg', 'png', 'gif'],
        multiple: false, //restrict upload to a single file
        folder: 'banners', //upload files to the specified folder
        tags: ['product', 'banner'], //add the given tags to the uploaded files
        maxImageFileSize: 5000000, //restrict file size to less than 5MB
        maxImageWidth: 800, //Scales the image down to a width of 800 pixels before uploading
      },
      (error: any, result: any) => {
        console.log(result);
        if (!error && result && result.event === 'success') {
          return result.info;
        }
        return error;
      }
    );
  }

  generateUniqueFilName(): string {
    const timestamp: number = new Date().getTime();
    const randomString: string = Math.random().toString(36).substr(2, 10); // Generate random string
    return timestamp.toString(36) + randomString; // Concatenate timestamp and random string
  }
}
