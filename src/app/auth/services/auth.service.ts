import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/';
  authCustomSegment = "auth/"
  authJWTSegments = "api/v1/auth/"

  constructor(private http: HttpClient) { }

  registerUser(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authCustomSegment}register/`, { email: email });
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authCustomSegment}confirm-email/`, { token: token });
  }
  
  setPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authCustomSegment}set-password/`, { token: token, password: password });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authJWTSegments}login/`, credentials);
  }

  setTokens(tokens: any): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  refreshToken(refresh: any): Observable<any> {
    return this.http.post(`${this.baseUrl}token/refresh/`, refresh);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${this.authCustomSegment}password-reset/`, { email: email });
  }

  resetPasswordConfirm(uid: string, token: string, newPassword: string): Observable<any> {
    const body = {
      uid,
      token,
      new_password1: newPassword,
      new_password2: newPassword
    };
    return this.http.post(`${this.baseUrl}${this.authCustomSegment}password-reset-confirm/`, body);
  }
}
