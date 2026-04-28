import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PagePanelComponent } from '../../shared/layout/page-panel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PagePanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly authService = inject(AuthService);

  readonly user = this.authService.user;
  readonly summary = 'This Angular page mirrors the legacy AngularJS home screen.';
}
