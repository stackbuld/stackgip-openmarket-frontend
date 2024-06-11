import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CloudinaryApiResponseDto } from './cloudinary.dto';
import { ToastrService } from 'ngx-toastr';
declare var cloudinary: any;

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private http = inject(HttpClient);
  private toast = inject(ToastrService);
  private imageCount = 0;
  private videoCount = 0;
  private maxFiles = 4;
  private videoTypes: string[] = ['gif', 'video', 'mp4'];
  private imageTypes: string[] = ['image', 'jpeg', 'jpg', 'png'];
  private allowedFileTypes: string[] = [...this.imageTypes, ...this.videoTypes];

  private imageSubject = new Subject<string>();
  private videoSubject = new Subject<string>();

  public image$ = this.imageSubject.asObservable();
  public video$ = this.videoSubject.asObservable();

  public uploadImage(formData: FormData): Observable<CloudinaryApiResponseDto> {
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

  createUploadWidget() {
    return cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
        sources: ['local', 'url'],
        multiple: true,
        maxFiles: 8, // To allow some flexibility in initial selection
        resourceType: 'auto',
        clientAllowedFormats: this.allowedFileTypes,
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#000000',
            tabIcon: '#000000',
            menuIcons: '#000000',
            textDark: '#000000',
            textLight: '#FFFFFF',
            link: '#000000',
            action: '#000000',
            inactiveTabIcon: '#0E2F5A',
            error: '#F44235',
            inProgress: '#000000',
            complete: '#20B832',
            sourceBg: '#E4EBF1',
          },
          window: {
            background: '#E4EBF1',
            border: '1px solid #90A0B3',
            width: '400px',
            height: '300px',
            borderRadius: '30px',
          },
          tab: {
            background: '#FFFFFF',
            activeBorderColor: '#000000',
            inactiveBorderColor: '#E4EBF1',
            borderRadius: '5px',
          },
          button: {
            background: '#000000',
            borderRadius: '5px',
          },
          dropzone: {
            background: '#F4F4F5',
            border: '2px dashed #90A0B3',
            borderRadius: '5px',
          },
          progress: {
            background: '#F4F4F5',
            borderRadius: '5px',
          },
          panel: {
            background: '#FFFFFF',
            borderRadius: '10px',
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": {
              url: 'https://fonts.googleapis.com/css?family=Fira+Sans',
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          this.handleUpload(result.info);
        }
      }
    );
  }

  private handleUpload(info: CloudinaryApiResponseDto) {
    const url = info.secure_url;
    if (this.imageCount == this.maxFiles) {
      this.imageCount++;
      this.toast.error(
        `${
          this.imageCount - this.maxFiles
        } images will not be added, you can only added total of 4 images and 4 videos`
      );
    } else if (
      this.imageTypes.some((img) => img == info.resource_type) &&
      this.imageCount <= this.maxFiles
    ) {
      this.imageSubject.next(url);
      this.imageCount++;
      console.log('image', this.imageCount);
    }

    if (this.videoCount == this.maxFiles) {
      this.videoCount++;
      this.toast.error(
        `${
          this.imageCount - this.maxFiles
        } videos will not be added, you can only added total of 4 images and 4 videos`
      );
    }
    if (
      this.videoTypes.some((v) => v == info.resource_type) &&
      this.videoCount <= this.maxFiles
    ) {
      this.videoSubject.next(url);
      this.videoCount++;
      console.log('video', this.videoCount);
    }
  }

  public generateUniqueFilName(): string {
    const timestamp: number = new Date().getTime();
    const randomString: string = Math.random().toString(36).substr(2, 10); // Generate random string
    return timestamp.toString(36) + randomString; // Concatenate timestamp and random string
  }
}
