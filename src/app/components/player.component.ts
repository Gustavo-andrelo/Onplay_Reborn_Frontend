import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie } from '../services/movie.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="player-header">
        <button (click)="goBack()" class="back-btn">← Voltar</button>
        <h2>{{ movie?.nome }}</h2>
      </div>
      
      <div class="player-container">
        <div class="video-placeholder">
          <div class="play-message">
            <h3>🎬 Reproduzindo: {{ movie?.nome }}</h3>
            <p>O filme está sendo reproduzido...</p>
            <div class="movie-details" *ngIf="movie">
              <p><strong>Ano:</strong> {{ movie.ano }}</p>
              <p><strong>Duração:</strong> {{ movie.duracao }} minutos</p>
              <p><strong>Gênero:</strong> {{ movie.genero }}</p>
              <p><strong>Descrição:</strong> {{ movie.descricao }}</p>
            </div>
          </div>
        </div>
        
        <div class="controls">
          <button class="control-btn">⏸️ Pausar</button>
          <button class="control-btn">⏹️ Parar</button>
          <button class="control-btn">🔊 Volume</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; }
    .player-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .back-btn { padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .player-container { max-width: 800px; margin: 0 auto; }
    .video-placeholder { 
      background: #000; 
      height: 400px; 
      border-radius: 8px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      color: white; 
      text-align: center; 
    }
    .play-message h3 { margin-bottom: 1rem; font-size: 1.5rem; }
    .movie-details { margin-top: 1rem; text-align: left; }
    .movie-details p { margin: 0.5rem 0; }
    .controls { 
      display: flex; 
      justify-content: center; 
      gap: 1rem; 
      margin-top: 1rem; 
      padding: 1rem; 
      background: #f8f9fa; 
      border-radius: 8px; 
    }
    .control-btn { 
      padding: 0.75rem 1.5rem; 
      background: #007bff; 
      color: white; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
    }
  `]
})
export class PlayerComponent implements OnInit {
  movie: Movie | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    const movieId = Number(this.route.snapshot.paramMap.get('id'));
    if (movieId) {
      this.loadMovie(movieId);
    }
  }

  loadMovie(id: number) {
    this.movieService.getMovie(id).subscribe({
      next: (movie) => this.movie = movie,
      error: (error) => {
        console.error('Erro ao carregar filme:', error);
        this.goBack();
      }
    });
  }

  goBack() {
    this.router.navigate(['/catalog']);
  }
}