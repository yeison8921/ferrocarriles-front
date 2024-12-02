import { Component } from '@angular/core';
import { InfoComponent } from './info/info.component';
import { SliderComponent } from './slider/slider.component';
import { MultimediaComponent } from './multimedia/multimedia.component';
import { Router } from '@angular/router';
import { AuthService } from '../auth/login/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [InfoComponent, SliderComponent, MultimediaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getRolByToken().subscribe({
      error: (error) => {
        if (error.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('isAuthenticated');
          this.router.navigate(['/login']);
        }
      },
    });
  }
}
