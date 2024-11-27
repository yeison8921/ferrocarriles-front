import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/login/auth.service';

const token = localStorage.getItem('token');

interface UpdatePageResponse {
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class PaginaService {
  private apiUrl = environment.apiUrl;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, public authService: AuthService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    }).set('Authorization', `Bearer ${authService.token()}`);
  }

  getPage(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginas/${id}`, {
      headers: this.headers,
    });
  }

  updatePage(id: number, data: any): Observable<UpdatePageResponse> {
    return this.http.put<UpdatePageResponse>(
      `${this.apiUrl}/paginas/${id}`,
      data,
      {
        headers: this.headers,
      }
    );
  }

  getSelectPages(): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/paginas/select`,
      {},
      {
        headers: this.headers,
      }
    );
  }

  addArea(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/areas`, data, {
      headers: this.headers,
    });
  }
}
