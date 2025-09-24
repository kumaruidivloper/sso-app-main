import { Injectable } from '@angular/core';

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SSOService {
  private readonly AUTH_KEY = 'sso_auth_data';

  async login(): Promise<AuthResult> {
    // Simulate SSO login process
    return new Promise((resolve) => {
      setTimeout(() => {
        const authData = {
          success: true,
          user: {
            id: '12345',
            name: 'Kumar Shan',
            email: 'kumar.shan@test.com'
          },
          token: 'jwt-token-here'
        };
        
        // Store in localStorage (cookies would be better for real SSO)
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(authData));
        
        // Set cookie for cross-tab communication
        document.cookie = `auth_token=${authData.token}; path=/; SameSite=Lax`;
        
        resolve(authData);
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    // Remove cookie
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  getAuthData(): any {
    const data = localStorage.getItem(this.AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }

  isAuthenticated(): boolean {
    return this.getAuthData() !== null;
  }
}