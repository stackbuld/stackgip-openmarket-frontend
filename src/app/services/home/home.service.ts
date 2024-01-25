import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface ContactUsData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  constructor(private http: HttpClient) {}

  sendContactUsRequest(data: ContactUsData) {
    return this.http.post(environment.contactUsWebhook, data);
  }
}
