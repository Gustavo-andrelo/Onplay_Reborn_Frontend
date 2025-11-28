import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="form-container">
        <h2>{{ isLogin ? 'Login' : 'Cadastro' }}</h2>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input type="text" [(ngModel)]="username" name="username" 
                   [placeholder]="isLogin ? 'Usuário ou Email' : 'Nome de Usuário'" required>
          </div>
          
          <div *ngIf="!isLogin" class="form-group">
            <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required>
          </div>
          
          <div class="form-group">
            <input type="password" [(ngModel)]="password" name="password" placeholder="Senha" required>
          </div>
          
          <div *ngIf="!isLogin" class="form-group">
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Confirmar Senha" required>
          </div>
          
          <div *ngIf="passwordErrors.length > 0" class="error-messages">
            <div *ngFor="let error of passwordErrors" class="error">{{ error }}</div>
          </div>
          
          <div *ngIf="errorMessage" class="error center-error">{{ errorMessage }}</div>
          
          <button type="submit" [disabled]="!isFormValid()">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</button>
        </form>
        
        <p>
          {{ isLogin ? 'Não tem conta?' : 'Já tem conta?' }}
          <a href="#" (click)="toggleMode($event)">{{ isLogin ? 'Cadastre-se' : 'Faça login' }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
    .form-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 350px; }
    h2 { text-align: center; margin-bottom: 1.5rem; color: #333; }
    .form-group { margin-bottom: 1rem; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 1rem; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .error-messages { margin: 1rem 0; background: #fff0f0; padding: 0.5rem; border-radius: 4px; border: 1px solid #ffcccc; }
    .error { color: #dc3545; font-size: 0.8rem; margin-bottom: 0.25rem; }
    .center-error { text-align: center; margin-top: 1rem; }
    p { text-align: center; margin-top: 1.5rem; }
    a { color: #007bff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  isLogin = true;
  username = '';
  email = ''; 
  password = '';
  confirmPassword = '';
  passwordErrors: string[] = [];
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  // AQUI ESTÁ A CORREÇÃO NA LÓGICA
  toggleMode(event: Event) {
    event.preventDefault(); // Impede o recarregamento da página
    this.isLogin = !this.isLogin;
    this.clearForm();
  }

  onSubmit() {
    this.errorMessage = '';
    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setAuthenticated(true);
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Usuário ou senha inválidos';
      }
    });
  }

  register() {
    this.passwordErrors = this.authService.validatePassword(this.password);
    
    if (this.passwordErrors.length > 0) return;
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem';
      return;
    }

    const newUser = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.authService.register(newUser).subscribe({
      next: (response) => {
        alert('Conta criada com sucesso! Faça login.');
        this.isLogin = true;
        this.clearForm();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erro ao criar usuário. Tente outro email/user.';
      }
    });
  }

  isFormValid(): boolean {
    if (this.isLogin) {
      return !!(this.username && this.password);
    }
    return !!(this.username && this.email && this.password && this.confirmPassword && this.passwordErrors.length === 0);
  }

  clearForm() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.passwordErrors = [];
    this.errorMessage = '';
  }
}