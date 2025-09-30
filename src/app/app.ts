import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from './services/shared-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  private app2Url = 'http://localhost:4201';
  // private app2Window: Window | null = null;
  message = signal<any>('Waiting for message... from App2');
  counter = signal<number>(0)
  selectedForm:any;

  constructor(
    public sharedService: SharedService
  ) {}

  // openApp2() {
  //   // ✅ This will work since it's directly from a user action
  //   this.app2Window = window.open(this.app2Url, 'app2');
  // }

  // sendMessageToApp2(value: any) {
  //   if (this.app2Window) {
  //     this.app2Window.postMessage(
  //       { type: 'GREETING_FROM_APP1', payload: 'Hello from App1!', process: value },
  //       this.app2Url
  //     );

  //   } else {
  //     console.warn('App2 window not opened yet');
  //   }
  // }

ngOnInit() {
  window.addEventListener('message', this.handleMessage);
}

handleMessage = (event: MessageEvent) => {
  if (event.origin !== 'http://localhost:4201') return;
  console.log('Message received in App1:', event.data);
  this.message.set(event.data);
  this.conterHandler(event.data.process);
};

conterHandler(value: any) {
  if(value === 'minus') {
    this.counter.set(this.counter() - 1);
  } else if(value === 'pluse') {
    this.counter.set(this.counter() + 1);
  }
}

incrementApp2(value: any) {
    this.sharedService.sendMessageToApp2(value);
}

decrementApp2(value: any) {
  this.sharedService.sendMessageToApp2(value);
}

onChange($event:any) {
  if (!this.sharedService.app2Window || this.sharedService.app2Window.closed) {
      this.sharedService.openApp2();
  }

  setTimeout(() => {
   this.sharedService.sendMessageToApp2($event.target.value);
  }, 100); // 100ms is usually enough
  
}
}
