import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PagePanelComponent } from '../../shared/layout/page-panel.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, PagePanelComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  readonly credentials = {
    username: '',
    password: ''
  };
  readonly error = signal('');

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    this.error.set('');

    if (!this.authService.login(this.credentials)) {
      this.error.set('Enter user name and password.');
      return;
    }

    void this.router.navigateByUrl('/home');
  }
}
