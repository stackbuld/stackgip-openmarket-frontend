export class ImageResolutionUtility {
  static getImageResolution(url: string, width: any, height: any) {
    return `https://res.cloudinary.com/votel/image/fetch/c_fill,g_auto,h_${height},w_${width}/b_auto:border,c_pad,h_${height},w_${width}/q_auto:best/${url}`;
  }

  static getMobileImageResolution(url: string, width: any, height: any) {
    return `https://res.cloudinary.com/votel/image/fetch/c_crop,g_auto,h_${height},w_${width}/b_auto:border,c_pad,h_${height},w_${width}/q_auto:best/${url}`;
  }

  static getVideoResolution(url: string, width: any, height: any) {
    url = url.substring(url.indexOf('v1'));
    return `https://res.cloudinary.com/dbmgmudf0/video/upload/c_fill,h_${height},q_auto:best,w_${width}/${url}`;
  }

  public static cropImageToFace(url: string, width: number, height: number):string {
  return `https://res.cloudinary.com/votel/image/fetch/c_crop,g_faces,h_${height},w_${width}/b_auto:border,c_pad,h_${height},w_${width}/q_auto:best/${url}`;
};

}
