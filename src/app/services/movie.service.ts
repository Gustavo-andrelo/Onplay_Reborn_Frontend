import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Movie {
  id: number;
  nome: string;
  descricao: string;
  genero: string;
  ano: number;
  duracao: number;
  faixaEtaria: string;
  poster: string;
  linkTrailer: string;
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8080/api/catalog';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getMovie(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.apiUrl}/${id}`);
  }

  createMovie(movie: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.post('http://localhost:8080/api/movies', movie, { headers });
  }

  updateMovie(id: number, movie: any): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.put(`http://localhost:8080/api/movies/${id}`, movie, { headers });
  }

  deleteMovie(id: number): Observable<any> {
    const headers = this.authService.getAuthHeaders();
    return this.http.delete(`http://localhost:8080/api/movies/${id}`, { headers });
  }
}