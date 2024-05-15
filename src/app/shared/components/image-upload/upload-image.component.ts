import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CloudinaryService } from 'src/app/services/cloudinary/cloudinary.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image-component.scss'],
})
export class UploadImageComponent {
  isUploading: boolean = false;
  isLoading: boolean = false;

  @Input() public useLabel: boolean = true;
  @Input() public label: string = '';
  @Output() public imageUploaded = new EventEmitter<string>();

  dragOver: boolean = false;
  file!: File;
  imageUrl: string;
  private ngSubscription = new Subject();

  private cloudinaryService = inject(CloudinaryService);
  private toastService = inject(ToastrService);

  previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  handleDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  handleDragLeave(): void {
    this.dragOver = true;
  }

  handleDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;

    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length > 0) {
      this.file = files[0];
      // this.previewImage(this.file);
      this.uploadImage();
    }
  }

  handleUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      // this.previewImage(this.file);
      this.uploadImage();
    }
  }

  isFileSizeAndTypeValid(file: File) {
    const maxSizeInBytes = 5 * 1024 * 1024;
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/jpeg/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    const isFileTypeValid = allowedTypes.includes(file.type);
    const isFileSizeValid = file.size <= maxSizeInBytes;
    return isFileTypeValid && isFileSizeValid;
  }

  uploadImage() {
    if (!this.file) {
      this.toastService.error('Please Upload an image.', 'Image Required');
      return;
    }
    if (!this.isFileSizeAndTypeValid(this.file)) {
      this.toastService.error(
        'Please select an valid Image file with maximum size of 5mb',
        'Error Uploading file'
      );
      return;
    }

    const uniqueFileName: string =
      this.cloudinaryService.generateUniqueFilName();
    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('upload_preset', environment.cloudinaryUploadPerset);
    formData.append('folder', 'banners');
    formData.append('public_id', uniqueFileName);
    formData.append('tags', 'banner');

    this.cloudinaryService
      .uploadImage(formData)
      .pipe(takeUntil(this.ngSubscription))
      .subscribe({
        next: (res) => {
          this.toastService.success('Image upload successful');
          this.imageUrl = res.secure_url;
          this.imageUploaded.emit(res.secure_url);
          this.isUploading = false;
        },
        error: (error) => {
          (this.isUploading = false),
            this.toastService.error('Image not uploaded. Try again.');
        },
      });
  }

  get getClass(): Record<string, string> {
    if (this.dragOver) {
      return { border: '3px dashed #fff', 'background-color': '#101828' };
    }
    if (this.imageUrl) {
      return { 'background-color': '#101828', border: '3px dashed #fff' };
    }
    return {};
  }

  ngOnDestroy(): void {
    this.ngSubscription.complete();
    this.ngSubscription.unsubscribe();
  }
}
