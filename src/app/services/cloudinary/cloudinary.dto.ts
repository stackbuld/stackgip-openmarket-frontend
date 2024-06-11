export interface CloudinaryApiResponseDto {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: Date;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  access_mode: string;
  existing: false;
  original_filename: string;
  original_extension: string;
}

export interface CloudinaryUploadWidgetConfig {
  cloudName: string;
  uploadPreset: string;
  sources?: string[];
  googleApiKey?: string;
  showAdvancedOptions?: boolean;
  cropping?: boolean;
  multiple?: boolean;
  resourceType?: string;
  defaultSource?: string;
  styles?: any; // Adjust the type as per your style object structure
  folder?: string;
  tags?: string[];
  context?: { [key: string]: string };
  clientAllowedFormats?: string[];
  maxFileSize?: number;
  maxImageWidth?: number;
  maxImageHeight?: number;
  minImageWidth?: number;
  minImageHeight?: number;
  maxFiles?: number;
  autoUpload?: boolean;
  theme?: string;
  language?: string;
  text?: { [key: string]: any }; // Adjust the type as per your text object structure
  thumbnails?: boolean;
  thumbnailTransformation?: any[];
}
