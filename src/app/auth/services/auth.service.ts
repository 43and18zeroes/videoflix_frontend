import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/auth/';

  constructor(private http: HttpClient) { }

  registerUser(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}register/`, { email: email });
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}confirm-email/`, { token: token });
  }
  
  setPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}set-password/`, { token: token, password: password });
  }
}
