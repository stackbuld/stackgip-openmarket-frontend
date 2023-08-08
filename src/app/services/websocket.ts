import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {retry, tap, delay, switchMap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {BehaviorSubject, Observable, ObservableInput} from 'rxjs';
import {NotificationResponseModel} from '../models/notificationResponse.model';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor() {
  }
  private socket$: WebSocketSubject<NotificationResponseModel> | null = null;
  public getSocket(url): WebSocketSubject<NotificationResponseModel> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.createWebSocket(url);
    }
    return this.socket$;
  }

  private createWebSocket(url):  WebSocketSubject<NotificationResponseModel> {
     return   this.connectToWebsocket(url);
  }

  private  connectToWebsocket(wssurl){
    const websocket =  webSocket<NotificationResponseModel>({
      url: wssurl,
      openObserver: {
        next: () => {
          console.log('WebSocket connection established');
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket connection closed');
          this.socket$ = null; // Reset the socket when the connection is closed to allow reconnection.
          this.reconnect(wssurl); // Try to reconnect immediately.
        }
      },
    });
    websocket
      .pipe(
        tap({
          error: (err) => console.log('WebSocket connection failed', err),
        }),
        retry({
          delay: (errors, retryCount)=> errors.pipe(
            tap(val => console.log(`WebSocket connection lost. Attempting to reconnect ${retryCount} times...`)),
            delay(1000)
          )
        }),
      );

    return websocket;
  }

  private reconnect(url) {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.createWebSocket(url);
    }
  }

  sendMessage(url: string,msg: any) {
    this.getSocket(url).next(msg);
  }

  closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}
