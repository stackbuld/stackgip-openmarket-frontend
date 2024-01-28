import {Injectable} from '@angular/core';
import {ApiAppUrlService} from '../api-app-url.service';
import {HttpClient} from '@angular/common/http';

export interface RefundPayload {
    orderNumber: string;
    unit: number;
    refundReason: string;
    imageUrls: string[];
    videoUrl: string;
}

@Injectable({providedIn: 'root'})
export class RefundService {
    baseUrl: string = '';

    constructor(private apiUrls: ApiAppUrlService, private http: HttpClient) {
        this.baseUrl = apiUrls.ecommerceBaseUrl;
    }

    requestRefund(payload: RefundPayload) {
        return this.http.post<{
            code: any;
            data: any;
            errors: string[];
            succeeded: boolean;
            message: any;
            status: any
        }>(this.baseUrl + 'refund/request', payload);
    }
}
