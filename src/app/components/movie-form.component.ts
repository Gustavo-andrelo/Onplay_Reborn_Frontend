import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-black text-white p-6">
      <div class="max-w-2xl mx-auto">
        <div class="flex items-center gap-4 mb-8">
          <button (click)="goBack()" 
                  class="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors">
            ← Voltar
          </button>
          <h2 class="text-3xl font-bold">Adicionar Filme</h2>
        </div>
        
        <div class="bg-gray-900 rounded-lg p-8">
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium mb-2">Nome do Filme</label>
                <input type="text" [(ngModel)]="movie.nome" name="nome" 
                       class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Gênero</label>
                <input type="text" [(ngModel)]="movie.genero" name="genero" 
                       class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Ano</label>
                <input type="number" [(ngModel)]="movie.ano" name="ano" 
                       class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Duração (min)</label>
                <input type="number" [(ngModel)]="movie.duracao" name="duracao" 
                       class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">Faixa Etária</label>
                <input type="text" [(ngModel)]="movie.faixaEtaria" name="faixaEtaria" 
                       class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">URL do Poster</label>
                <input type="url" [(ngModel)]="movie.poster" name="poster" 
                       class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">URL do Trailer</label>
              <input type="url" [(ngModel)]="movie.linkTrailer" name="linkTrailer" 
                     class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none" required>
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Descrição</label>
              <textarea [(ngModel)]="movie.descricao" name="descricao" rows="4"
                        class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-md focus:border-red-500 focus:outline-none resize-none" required></textarea>
            </div>
            
            <div *ngIf="errorMessage" class="text-red-400 text-center">{{ errorMessage }}</div>
            
            <div class="flex gap-4">
              <button type="button" (click)="goBack()" 
                      class="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-md font-medium transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="!isFormValid()" 
                      class="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-md font-medium transition-colors">
                Adicionar Filme
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class MovieFormComponent {
  movie = {
    nome: '',
    descricao: '',
    genero: '',
    ano: null,
    duracao: null,
    faixaEtaria: '',
    poster: '',
    linkTrailer: ''
  };
  errorMessage = '';

  constructor(private movieService: MovieService, private router: Router) {}

  onSubmit() {
    this.movieService.createMovie(this.movie).subscribe({
      next: () => {
        alert('Filme adicionado com sucesso!');
        this.router.navigate(['/catalog']);
      },
      error: () => this.errorMessage = 'Erro ao adicionar filme'
    });
  }

  isFormValid(): boolean {
    return !!(this.movie.nome && this.movie.descricao && this.movie.genero && 
              this.movie.ano && this.movie.duracao && this.movie.faixaEtaria && 
              this.movie.poster && this.movie.linkTrailer);
  }

  goBack() {
    this.router.navigate(['/catalog']);
  }
}