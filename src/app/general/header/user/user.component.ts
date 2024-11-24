import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../auth/login/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserMenuComponent {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.performLogout();
  }
}
