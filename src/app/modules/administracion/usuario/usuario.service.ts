import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { AuthService } from '../../../auth/login/auth.service';

const token = localStorage.getItem('token');

interface UpdatePageResponse {
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, public authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.token()}`,
    });
  }

  getRoles(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/roles/select`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
    });
  }

  getUser(id: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: this.getHeaders(),
    });
  }
}
