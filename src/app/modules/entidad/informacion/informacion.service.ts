import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroments/environment';
import { AuthService } from '../../../auth/login/auth.service';

const token = localStorage.getItem('token');

@Injectable({
  providedIn: 'root',
})
export class InformacionService {
  private apiUrl = environment.apiUrl;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, public authService: AuthService) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' }).set(
      'Authorization',
      `Bearer ${authService.token()}`
    );
  }

  getPaginas(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginas/${id}`, {
      headers: this.headers,
    });
  }

  getNormatividades(tipoNormatividadId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/normatividadesByType`,
      { tipo_normatividad_id: tipoNormatividadId },
      {
        headers: this.headers,
      }
    );
  }
}
