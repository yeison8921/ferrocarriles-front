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
  private headers: HttpHeaders;

  constructor(private http: HttpClient, public authService: AuthService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    }).set('Authorization', `Bearer ${authService.token()}`);
  }

  getRoles(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/roles/select`,
      {},
      {
        headers: this.headers,
      }
    );
  }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.headers,
    });
  }

  getUser(id: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: this.headers,
    });
  }

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data, {
      headers: this.headers,
    });
  }

  // updatePage(id: number, data: any): Observable<UpdatePageResponse> {
  //   return this.http.put<UpdatePageResponse>(
  //     `${this.apiUrl}/paginas/${id}`,
  //     data,
  //     {
  //       headers: this.headers,
  //     }
  //   );
  // }
}
