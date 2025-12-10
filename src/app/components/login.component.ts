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
    <div class="min-h-screen bg-black flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-black bg-opacity-75 rounded-lg p-8 border border-gray-800">
        <h2 class="text-3xl font-bold text-white text-center mb-8">{{ isLogin ? 'Entrar' : 'Criar Conta' }}</h2>
        
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <input type="text" [(ngModel)]="username" name="username" 
                   [placeholder]="isLogin ? 'Email ou usuário' : 'Nome de usuário'" 
                   class="w-full px-4 py-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-red-500 focus:outline-none" required>
          </div>
          
          <div *ngIf="!isLogin">
            <input type="email" [(ngModel)]="email" name="email" placeholder="Email" 
                   class="w-full px-4 py-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-red-500 focus:outline-none" required>
          </div>
          
          <div>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Senha" 
                   (ngModelChange)="onPasswordChange()"
                   class="w-full px-4 py-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-red-500 focus:outline-none" required>
          </div>
          
          <div *ngIf="!isLogin">
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Confirmar senha" 
                   class="w-full px-4 py-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:border-red-500 focus:outline-none" required>
          </div>
          
          <div *ngIf="!isLogin" class="text-xs text-gray-400 space-y-1">
            <p class="font-medium">Requisitos da senha:</p>
            <ul class="list-disc list-inside space-y-0.5">
              <li>Mínimo 8 caracteres</li>
              <li>1 letra maiúscula</li>
              <li>1 letra minúscula</li>
              <li>1 número</li>
              <li>1 caractere especial (!&#64;#$%^&amp;*)</li>
            </ul>
          </div>
          
          <div *ngIf="passwordErrors.length > 0" class="bg-red-900 bg-opacity-50 border border-red-600 rounded-md p-3">
            <div *ngFor="let error of passwordErrors" class="text-red-300 text-sm">{{ error }}</div>
          </div>
          
          <div *ngIf="errorMessage" class="text-red-400 text-center text-sm">{{ errorMessage }}</div>
          
          <button type="submit" [disabled]="!isFormValid()" 
                  class="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold rounded-md transition-colors">
            {{ isLogin ? 'Entrar' : 'Criar Conta' }}
          </button>
        </form>
        
        <p class="text-gray-400 text-center mt-6">
          {{ isLogin ? 'Novo por aqui?' : 'Já tem uma conta?' }}
          <a href="#" (click)="toggleMode($event)" class="text-white hover:underline ml-1">
            {{ isLogin ? 'Assine agora' : 'Entre agora' }}
          </a>
        </p>
      </div>
    </div>
  `,
  styles: []
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
        if (response.role) {
          this.authService.setUserRole(response.role);
        }
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
    
    if (!this.password) {
      return false;
    }
    
    const passwordValid = this.authService.validatePassword(this.password).length === 0;
    return !!(this.username && this.email && this.password && this.confirmPassword && passwordValid);
  }

  onPasswordChange() {
    if (!this.isLogin && this.password) {
      this.passwordErrors = this.authService.validatePassword(this.password);
    }
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