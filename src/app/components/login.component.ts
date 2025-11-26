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
            <input type="text" [(ngModel)]="username" name="username" placeholder="Usuário" required>
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
          
          <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
          
          <button type="submit" [disabled]="!isFormValid()">{{ isLogin ? 'Entrar' : 'Cadastrar' }}</button>
        </form>
        
        <p>
          {{ isLogin ? 'Não tem conta?' : 'Já tem conta?' }}
          <a href="#" (click)="toggleMode()">{{ isLogin ? 'Cadastre-se' : 'Faça login' }}</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
    .form-container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); width: 300px; }
    .form-group { margin-bottom: 1rem; }
    input { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
    button { width: 100%; padding: 0.75rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .error-messages { margin: 1rem 0; }
    .error { color: red; font-size: 0.8rem; margin-bottom: 0.5rem; }
    a { color: #007bff; text-decoration: none; }
  `]
})
export class LoginComponent {
  isLogin = true;
  username = '';
  password = '';
  confirmPassword = '';
  passwordErrors: string[] = [];
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.clearForm();
  }

  onSubmit() {
    if (this.isLogin) {
      this.login();
    } else {
      this.register();
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.authService.setAuthenticated(true);
        this.router.navigate(['/catalog']);
      },
      error: () => this.errorMessage = 'Credenciais inválidas'
    });
  }

  register() {
    this.passwordErrors = this.authService.validatePassword(this.password);
    
    if (this.passwordErrors.length > 0) return;
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Senhas não coincidem';
      return;
    }

    this.authService.register({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.errorMessage = '';
        this.isLogin = true;
        this.clearForm();
      },
      error: () => this.errorMessage = 'Erro ao criar usuário'
    });
  }

  isFormValid(): boolean {
    if (this.isLogin) {
      return this.username && this.password;
    }
    return this.username && this.password && this.confirmPassword && this.passwordErrors.length === 0;
  }

  clearForm() {
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.passwordErrors = [];
    this.errorMessage = '';
  }
}