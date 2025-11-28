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
    <div class="container">
      <div class="form-container">
        <h2>Adicionar Filme</h2>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input type="text" [(ngModel)]="movie.nome" name="nome" placeholder="Nome" required>
          </div>
          
          <div class="form-group">
            <textarea [(ngModel)]="movie.descricao" name="descricao" placeholder="Descrição" required></textarea>
          </div>
          
          <div class="form-group">
            <input type="text" [(ngModel)]="movie.genero" name="genero" placeholder="Gênero" required>
          </div>
          
          <div class="form-group">
            <input type="number" [(ngModel)]="movie.ano" name="ano" placeholder="Ano" required>
          </div>
          
          <div class="form-group">
            <input type="number" [(ngModel)]="movie.duracao" name="duracao" placeholder="Duração (min)" required>
          </div>
          
          <div class="form-group">
            <input type="text" [(ngModel)]="movie.faixaEtaria" name="faixaEtaria" placeholder="Faixa Etária" required>
          </div>
          
          <div class="form-group">
            <input type="url" [(ngModel)]="movie.poster" name="poster" placeholder="URL do Poster" required>
          </div>
          
          <div class="form-group">
            <input type="url" [(ngModel)]="movie.linkTrailer" name="linkTrailer" placeholder="URL do Trailer" required>
          </div>
          
          <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
          
          <div class="buttons">
            <button type="button" (click)="goBack()" class="cancel-btn">Cancelar</button>
            <button type="submit" [disabled]="!isFormValid()">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; }
    .form-container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 1rem; }
    input, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    textarea { height: 100px; resize: vertical; }
    .buttons { display: flex; gap: 1rem; margin-top: 1.5rem; }
    button { flex: 1; padding: 0.75rem; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
    button[type="submit"] { background: #28a745; color: white; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .cancel-btn { background: #6c757d; color: white; }
    .error { color: #dc3545; margin: 1rem 0; text-align: center; }
  `]
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