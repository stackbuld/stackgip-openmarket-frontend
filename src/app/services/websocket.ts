import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { retryWhen, tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket$: WebSocketSubject<any>;

  public connect(): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
    }
    return this.socket$;
  }

  private getWebSocketUrl(){

  }
  private getNewWebSocket() {
    return webSocket({
      url: 'ws://your-websocket-url',
      openObserver: {
        next: () => {
          console.log('WebSocket connection established');
        }
      },
      closeObserver: {
        next: () => {
          console.log('WebSocket connection closed');
        }
      },
    }).pipe(
      tap({
        error: () => console.log('WebSocket connection failed'),
      }),
      retryWhen(errors =>
        errors.pipe(
          tap(val => console.log(`WebSocket connection lost. Attempting to reconnect...`)),
          delay(1000)
        )
      )
    );
  }

  sendMessage(msg: any) {
    this.connect().next(msg);
  }

  closeConnection() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
