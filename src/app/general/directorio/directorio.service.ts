import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { AuthService } from '../../auth/login/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DirectorioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, public authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.token()}`,
    });
  }

  getFuncionario(funcionarioId: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/funcionarios/${funcionarioId}`, {
      headers: this.getHeaders(),
    });
  }

  addFuncionario(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/funcionarios`, data, {
      headers: this.getHeaders(),
    });
  }

  updateFuncionario(funcionarioId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/funcionarios/${funcionarioId}`, data, {
      headers: this.getHeaders(),
    });
  }

  deleteFuncionario(funcionarioId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/funcionarios/${funcionarioId}`, {
      headers: this.getHeaders(),
    });
  }

  updateArea(areaId: number, areaName: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/areas/${areaId}`,
      { nombre: areaName },
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteArea(areaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/areas/${areaId}`, {
      headers: this.getHeaders(),
    });
  }
}
