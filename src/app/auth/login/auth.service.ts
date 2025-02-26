import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private router: Router) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, loginData, {
      headers: this.headers,
    });
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.get(`${this.apiUrl}/auth/logout`, {
      headers,
    });
  }

  isAuthenticated(): boolean {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return !!isAuthenticated;
  }

  token(): string | null {
    return localStorage.getItem('token') || '';
  }

  name(): string | null {
    return localStorage.getItem('name') || '';
  }

  getRolByToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.get(`${this.apiUrl}/users/getUserByToken`, { headers });
  }

  checkCurrentPassword(password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.post(
      `${this.apiUrl}/users/checkCurrentPassword`,
      { password: password },
      {
        headers,
      }
    );
  }

  updatePassword(password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.post(
      `${this.apiUrl}/users/updatePassword`,
      { password: password },
      {
        headers,
      }
    );
  }

  resetPassword(id: number | null, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token()}`,
    });

    return this.http.post(
      `${this.apiUrl}/users/resetPassword`,
      { id: id, password: password },
      {
        headers,
      }
    );
  }

  performLogout(): void {
    this.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('name');
      },
      error: (err) => console.error('Logout failed', err),
    });
  }
}
