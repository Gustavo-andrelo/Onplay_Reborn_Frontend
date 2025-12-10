import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService, Movie } from '../services/movie.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black text-white">
      <header class="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 class="text-3xl font-bold text-red-600">OnPlay</h1>
        <div class="flex gap-3">
          <button *ngIf="authService.isAdmin()" (click)="addMovie()" 
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium transition-colors">
            ➕ Adicionar Filme
          </button>
          <button (click)="logout()" 
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors">
            Sair
          </button>
        </div>
      </header>
      
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-6">Catálogo</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div *ngFor="let movie of movies" 
               class="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer group"
               (click)="playMovie(movie.id)">
            <div class="aspect-[2/3] bg-gray-800 overflow-hidden">
              <img [src]="movie.poster" [alt]="movie.nome" 
                   class="w-full h-full object-cover"
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
              <div class="w-full h-full bg-gray-800 flex items-center justify-center" style="display: none;">
                <span class="text-4xl">🎥</span>
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg mb-2 group-hover:text-red-400 transition-colors">{{ movie.nome }}</h3>
              <div class="space-y-1 text-sm text-gray-400">
                <p>{{ movie.ano }} • {{ movie.duracao }}min • {{ movie.genero }}</p>
                <p class="text-gray-300 line-clamp-2">{{ movie.descricao }}</p>
              </div>
              <button class="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors">
                ▶ Assistir
              </button>
            </div>
          </div>
        </div>
        
        <div *ngIf="movies.length === 0" class="text-center text-gray-400 mt-12">
          <p class="text-xl">Nenhum filme encontrado</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CatalogComponent implements OnInit {
  movies: Movie[] = [];

  constructor(
    private movieService: MovieService, 
    private router: Router,
    public authService: AuthService 
  ) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (movies) => this.movies = movies,
      error: (error) => console.error('Erro ao carregar filmes:', error)
    });
  }

  addMovie() {
    this.router.navigate(['/movies/new']);
  }

  playMovie(movieId: number) {
    this.router.navigate(['/player', movieId]);
  }

  logout() {
    this.authService.setAuthenticated(false);
    this.router.navigate(['/login']);
  }
}