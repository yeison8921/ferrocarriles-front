import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  login: LoginData = {
    email: '',
    password: '',
  };

  loginError: boolean = false;

  showLoading() {
    Swal.fire({
      text: 'Espere un poco por favor.',
      imageUrl: 'assets/loading.gif',
      imageWidth: 70,
      imageHeight: 70,
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
  }

  closeLoading() {
    Swal.close();
  }

  onLogin(loginForm: any) {
    if (loginForm.valid) {
      this.showLoading();
      this.authService.login(this.login).subscribe((data) => {
        if (data.status) {
          this.closeLoading();
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('token', data.token);
          localStorage.setItem('name', data.nombre);
          this.router.navigate(['index']);
        } else {
          this.closeLoading();
          this.loginError = true;
        }
      });
    }
  }
}
