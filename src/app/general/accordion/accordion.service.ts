import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment';
import { AuthService } from '../../auth/login/auth.service';

const token = localStorage.getItem('token');

interface UpdatePageResponse {
  status: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccordionService {
  private apiUrl = environment.apiUrl;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, public authService: AuthService) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    }).set('Authorization', `Bearer ${authService.token()}`);
  }

  addMultipleCategories(data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/categorias/addMultipleCategories`,
      data,
      {
        headers: this.headers,
      }
    );
  }

  updateCategory(categoryId: number, categoryName: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/categorias/${categoryId}`,
      { nombre: categoryName },
      {
        headers: this.headers,
      }
    );
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorias/${categoryId}`, {
      headers: this.headers,
    });
  }

  addMultipleDocuments(data: any): Observable<any> {
    const headers = this.headers.delete('Content-Type');
    return this.http.post(
      `${this.apiUrl}/documentos/addMultipleDocuments`,
      data,
      {
        headers: headers,
      }
    );
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/documentos/${documentId}`, {
      headers: this.headers,
    });
  }
}