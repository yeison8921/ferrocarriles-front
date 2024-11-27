import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/login/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InformacionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, public authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.token()}`,
    });
  }

  getPaginas(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginas/${id}`, {
      headers: this.getHeaders(),
    });
  }

  getNormatividades(tipoNormatividadId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/normatividadesByType`,
      { tipo_normatividad_id: tipoNormatividadId },
      {
        headers: this.getHeaders(),
      }
    );
  }
}
