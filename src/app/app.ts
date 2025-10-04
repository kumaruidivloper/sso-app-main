import { Component, signal, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedService } from './services/shared-service';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,FormsModule, MatButtonModule, MatSelectModule, MatRadioModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements AfterViewInit {
  //private app2Url = 'http://localhost:4201';
  private app2Url = 'https://kumaruidivloper.github.io/sso-app-sub/';
  // private app2Window: Window | null = null;
  message = signal<any>('Waiting for message... from App2');
  counter = signal<number>(0)
  selectedForm: string = 'Please select the form';
  selectedOption: string = '1';
  @ViewChild('myIframe') myIframe!: ElementRef<HTMLInputElement>;
  iframeSize!: number;

  constructor(
    public sharedService: SharedService
  ) {
  }

ngOnInit() {
  window.addEventListener('message', this.handleMessage);
}

ngAfterViewInit() {
    // console.log(this.myIframe.nativeElement);
  }

handleMessage = (event: MessageEvent) => {
  const expectedPath = '/sso-app-sub/';
  if (event.origin + expectedPath  !== 'https://kumaruidivloper.github.io/sso-app-sub/') return;
  // if (event.origin  !== 'http://localhost:4201') return;
  console.log('Message received in App1:', event.data);
  this.message.set(event.data);
  this.conterHandler(event.data.process);
  this.myIframe.nativeElement.style.height = event.data.iframeSize + 'px'
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
    this.sharedService.onIframeLoad(value, false)
}

decrementApp2(value: any) {
  this.sharedService.sendMessageToApp2(value);
  this.sharedService.onIframeLoad(value, false)
}

onChange($event:MatSelectChange) {
  this.sharedService.updateSeletedOption(this.selectedOption)
  if(this.selectedOption === '2') {
     if (!this.sharedService.app2Window || this.sharedService.app2Window.closed) {
      this.sharedService.openApp2();
    }
  } else {
    this.sharedService.onIframeLoad($event.value, true);
  }
 

  setTimeout(() => {
    console.log()
   this.sharedService.sendMessageToApp2($event.value);
  }, 100); // 100ms is usually enough
  
}

}
