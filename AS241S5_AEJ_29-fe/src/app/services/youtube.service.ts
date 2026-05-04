import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Youtube } from '../models/youtube.model';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private apiUrl = 'https://studious-orbit-r4rq4rwxrqwv3wpjj-8085.app.github.dev/api/youtube';

  constructor(private http: HttpClient) {}

  descargar(url: string): Observable<Youtube> {
    const params = new HttpParams().set('url', url);
    return this.http.get<Youtube>(`${this.apiUrl}/download`, { params });
  }

  historial(): Observable<Youtube[]> {
    return this.http.get<Youtube[]>(`${this.apiUrl}/history`);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, body: { status: string }): Observable<Youtube> {
    return this.http.put<Youtube>(`${this.apiUrl}/${id}`, body);
  }
}
