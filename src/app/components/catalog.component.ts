import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService, Movie } from '../services/movie.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <header>
        <h1>Catálogo de Filmes</h1>
        <button (click)="logout()" class="logout-btn">Sair</button>
      </header>
      
      <div class="movies-grid">
        <div *ngFor="let movie of movies" class="movie-card" (click)="playMovie(movie.id)">
          <h3>{{ movie.nome }}</h3>
          <div class="movie-info">
            <p><strong>Ano:</strong> {{ movie.ano }}</p>
            <p><strong>Duração:</strong> {{ movie.duracao }} min</p>
            <p><strong>Gênero:</strong> {{ movie.genero }}</p>
            <p *ngIf="movie.diretor"><strong>Diretor:</strong> {{ movie.diretor }}</p>
            <p *ngIf="movie.sinopse" class="sinopse">{{ movie.sinopse }}</p>
          </div>
          <button class="play-btn">▶ Assistir</button>
        </div>
      </div>
      
      <div *ngIf="movies.length === 0" class="no-movies">
        Nenhum filme encontrado
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .logout-btn { padding: 0.5rem 1rem; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .movie-card { background: white; border-radius: 8px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; }
    .movie-card:hover { transform: translateY(-2px); }
    .movie-info p { margin: 0.5rem 0; }
    .sinopse { font-style: italic; color: #666; }
    .play-btn { width: 100%; padding: 0.75rem; background: #28a745; color: white; border: none; border-radius: 4px; margin-top: 1rem; cursor: pointer; }
    .no-movies { text-align: center; color: #666; margin-top: 2rem; }
  `]
})
export class CatalogComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (movies) => this.movies = movies,
      error: (error) => console.error('Erro ao carregar filmes:', error)
    });
  }

  playMovie(movieId: number) {
    this.router.navigate(['/player', movieId]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}