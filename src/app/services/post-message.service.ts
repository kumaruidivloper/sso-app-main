import { Injectable } from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface PostMessage {
  type: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PostMessageService {
  private messagesSubject = new Subject<PostMessage>();
  private targetWindow: Window | null = null;
  private targetOrigin: string = '';

  constructor() {
    // Listen for incoming messages
    fromEvent<MessageEvent>(window, 'message')
      .pipe(
        filter(event => this.isValidMessage(event)),
        map(event => event.data)
      )
      .subscribe(data => {
        this.messagesSubject.next(data);
      });
  }

  get messages$(): Observable<PostMessage> {
    return this.messagesSubject.asObservable();
  }

  setTargetWindow(targetWindow: Window | null, origin: string) {
    this.targetWindow = targetWindow;
    this.targetOrigin = origin;
  }

  sendMessage(message: PostMessage) {
    if (this.targetWindow && !this.targetWindow.closed) {
      this.targetWindow.postMessage(message, this.targetOrigin);
    }
  }

  private isValidMessage(event: MessageEvent): boolean {
    // Add origin validation for security
    const allowedOrigins = ['http://localhost:4200', 'http://localhost:4201'];
    return allowedOrigins.includes(event.origin);
  }
}