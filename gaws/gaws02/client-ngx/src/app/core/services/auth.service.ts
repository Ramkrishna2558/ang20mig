import { Injectable, signal } from '@angular/core';

export interface GawsUser {
  displayName: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userState = signal<GawsUser>({
    displayName: 'Migration Tester',
    email: 'tester@gaws.local',
    role: 'Operations Analyst'
  });

  readonly user = this.userState.asReadonly();

  login(credentials: LoginCredentials): boolean {
    return Boolean(credentials.username && credentials.password);
  }

  logout(): void {
    return;
  }

  changePassword(currentPassword: string, newPassword: string): boolean {
    return Boolean(currentPassword && newPassword.length >= 8);
  }
}
