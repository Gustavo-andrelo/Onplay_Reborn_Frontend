import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userRole = '';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const authToken = btoa(username + ':' + password);
    localStorage.setItem('auth_token', authToken);
    return this.http.post(`${this.apiUrl}/auth/login`, { login: username, password });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  setAuthenticated(value: boolean) {
    this.isAuthenticatedSubject.next(value);
  }

  setUserRole(role: string) {
    this.userRole = role;
    localStorage.setItem('userRole', role);
  }

  getRole(): string {
    return this.userRole || localStorage.getItem('userRole') || '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': 'Basic ' + token
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  validatePassword(password: string): string[] {
    const errors = [];
    if (password.length < 8) errors.push('Senha deve ter pelo menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errors.push('Senha deve conter pelo menos uma letra maiúscula');
    if (!/[a-z]/.test(password)) errors.push('Senha deve conter pelo menos uma letra minúscula');
    if (!/[0-9]/.test(password)) errors.push('Senha deve conter pelo menos um número');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Senha deve conter pelo menos um caractere especial');
    return errors;
  }
}