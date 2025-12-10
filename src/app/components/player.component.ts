import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService, Movie } from '../services/movie.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black text-white">
      <div class="flex items-center gap-4 p-6 border-b border-gray-800">
        <button (click)="goBack()" 
                class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors">
          ← Voltar
        </button>
        <h2 class="text-2xl font-bold">{{ movie?.nome }}</h2>
      </div>
      
      <div class="max-w-6xl mx-auto p-6">
        <div class="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
          <div class="text-center">
            <div class="text-6xl mb-4">🎬</div>
            <h3 class="text-2xl font-bold mb-2">Reproduzindo: {{ movie?.nome }}</h3>
            <p class="text-gray-400">Simulando reprodução do filme...</p>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>
        
        <div class="flex justify-center gap-4 mb-8">
          <button class="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-colors">
            ⏸️ Pausar
          </button>
          <button class="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-colors">
            ⏹️ Parar
          </button>
          <button class="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-md font-medium transition-colors">
            🔊 Volume
          </button>
        </div>
        
        <div *ngIf="movie" class="bg-gray-900 rounded-lg p-6">
          <h4 class="text-xl font-semibold mb-4">Detalhes do Filme</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <p><span class="text-white font-medium">Ano:</span> {{ movie.ano }}</p>
            <p><span class="text-white font-medium">Duração:</span> {{ movie.duracao }} minutos</p>
            <p><span class="text-white font-medium">Gênero:</span> {{ movie.genero }}</p>
            <p class="md:col-span-2"><span class="text-white font-medium">Descrição:</span> {{ movie.descricao }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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