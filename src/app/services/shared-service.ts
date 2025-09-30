import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    private app2Url = 'http://localhost:4201';
    public app2Window: Window | null = null;
  
    openApp2() {
      // ✅ This will work since it's directly from a user action
      this.app2Window = window.open(this.app2Url, 'app2');
    }

    sendMessageToApp2(value: any) {
      if (this.app2Window) {
        this.app2Window.postMessage(
          { type: 'GREETING_FROM_APP1', payload: 'Hello from App1!', process: value },
          this.app2Url
        );

      } else {
        console.warn('App2 window not opened yet');
      }
    }



}
