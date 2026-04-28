import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PagePanelComponent } from '../../shared/layout/page-panel.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, RouterLink, PagePanelComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  readonly form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  readonly message = signal('');

  constructor(private readonly authService: AuthService) {}

  changePassword(): void {
    if (this.form.newPassword !== this.form.confirmPassword) {
      this.message.set('New password and confirmation must match.');
      return;
    }

    if (!this.authService.changePassword(this.form.currentPassword, this.form.newPassword)) {
      this.message.set('Enter current password and a new password with at least 8 characters.');
      return;
    }

    this.message.set('Password updated.');
  }
}
