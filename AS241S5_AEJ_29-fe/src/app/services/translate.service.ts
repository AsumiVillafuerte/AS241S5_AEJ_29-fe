import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Translate } from '../models/translate.model';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private apiUrl = 'https://studious-orbit-r4rq4rwxrqwv3wpjj-8085.app.github.dev/api/translate';

  constructor(private http: HttpClient) {}

  traducir(text: string, to: string, from: string = 'auto'): Observable<Translate> {
    return this.http.post<Translate>(
      `${this.apiUrl}?from=${from}&to=${to}`,
      { text }
    );
  }

  historial(): Observable<Translate[]> {
    return this.http.get<Translate[]>(`${this.apiUrl}/history`);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, body: { original: string; to: string; status: string }): Observable<Translate> {
    return this.http.put<Translate>(`${this.apiUrl}/${id}`, body);
  }
}