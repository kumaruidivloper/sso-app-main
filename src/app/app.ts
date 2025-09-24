import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SSOService } from './services/sso-service';
import { PostMessageService } from './services/post-message.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  protected title = 'sso-app-main';

  private destroy$ = new Subject<void>();
  
  isLoggedIn = false;
  userInfo: any = null;
  communicationLogs: string[] = [];
  
  private ssoService = inject(SSOService);
  private postMessageService = inject(PostMessageService);

  ngOnInit() {
    // Check if already logged in
    this.checkAuthStatus();
    
    // Listen for messages from sub-application
    this.postMessageService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => {
        this.handleMessage(message);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async login() {
    try {
      const result = await this.ssoService.login();
      if (result.success) {
        this.isLoggedIn = true;
        this.userInfo = result.user;
        this.addLog('Main app: User logged in successfully');
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.addLog('Main app: Login failed');
    }
  }

  logout() {
    this.ssoService.logout();
    this.isLoggedIn = false;
    this.userInfo = null;
    this.addLog('Main app: User logged out');
    
    // Notify sub-application about logout
    this.postMessageService.sendMessage({
      type: 'LOGOUT',
      timestamp: new Date().toISOString()
    });
  }

  openSubApp() {
    const subAppUrl = 'http://localhost:4201'; // Sub-application URL
    // popup
    //const popup = window.open(subAppUrl, 'sub-app', 'width=800,height=600');
    //const newTab = window.open(subAppUrl, 'sub-app', '_blank');
    const newTab = window.open(subAppUrl, '_blank');
    
    // Store reference to communicate
    //this.postMessageService.setTargetWindow(popup, subAppUrl);
    this.postMessageService.setTargetWindow(newTab, subAppUrl);
    
    this.addLog('Main app: Opening sub-application');
  }

  private checkAuthStatus() {
    const authData = this.ssoService.getAuthData();
    if (authData) {
      this.isLoggedIn = true;
      this.userInfo = authData.user;
      this.addLog('Main app: Restored login session');
    }
  }

  private handleMessage(message: any) {
    switch (message.type) {
      case 'SUB_APP_READY':
        this.addLog('Sub app: Ready to receive data');
        // Send current auth status to sub-application
        this.postMessageService.sendMessage({
          type: 'AUTH_STATUS',
          isLoggedIn: this.isLoggedIn,
          userInfo: this.userInfo,
          timestamp: new Date().toISOString()
        });
        break;
        
      case 'REQUEST_AUTH_STATUS':
        this.addLog('Sub app: Requesting auth status');
        this.postMessageService.sendMessage({
          type: 'AUTH_STATUS',
          isLoggedIn: this.isLoggedIn,
          userInfo: this.userInfo,
          timestamp: new Date().toISOString()
        });
        break;
        
      default:
        this.addLog(`Received unknown message: ${message.type}`);
    }
  }

  private addLog(message: string) {
    this.communicationLogs.unshift(`${new Date().toLocaleTimeString()}: ${message}`);
    if (this.communicationLogs.length > 10) {
      this.communicationLogs = this.communicationLogs.slice(0, 10);
    }
  }
}
