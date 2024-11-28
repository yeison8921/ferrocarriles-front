import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../auth/login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [NgbDropdownModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserMenuComponent {
  constructor(private authService: AuthService, private router: Router) {}
  name: string | null = '';

  ngOnInit(): void {
    this.name = this.authService.name();
  }

  onLogout() {
    this.authService.performLogout();
  }

  navigateChangePassword() {
    this.router.navigate(['change-password']);
  }
}
