import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  login: LoginData = {
    email: '',
    password: '',
  };

  onLogin() {
    this.authService.login(this.login).subscribe((data) => {
      if (data.status) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);
        this.router.navigate(['entidad/informacion-general']);
        // this.router.navigateByUrl('entidad/informacion-general');
      } else {
        alert('usuario y/o contraseña incorrecta');
      }
    });
  }
}
