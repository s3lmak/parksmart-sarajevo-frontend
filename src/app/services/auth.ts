import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

interface BackendUser {
  id: number | string;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/users`;
  private readonly storageKey = 'parksmart_user';

  constructor(private http: HttpClient) {}

  register(fullName: string, email: string, password: string): Observable<AuthResult> {
    return this.http.post<BackendUser>(this.apiUrl, { fullName, email, password }).pipe(
      map(backendUser => {
        const user: User = { id: String(backendUser.id), fullName: backendUser.fullName, email: backendUser.email };
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        return { success: true };
      }),
      catchError(() => of({ success: false, error: 'Registration failed. Please try again.' }))
    );
  }

  login(email: string, password: string): Observable<AuthResult> {
    return this.http.post<BackendUser>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(user => {
        const mappedUser: User = {
          id: String(user.id),
          fullName: user.fullName,
          email: user.email,
          role: user.role
        };
        localStorage.setItem(this.storageKey, JSON.stringify(mappedUser));
        return { success: true };
      }),
      catchError(() => of({ success: false, error: 'Invalid credentials.' }))
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.storageKey);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return null;
    return JSON.parse(data) as User;
  }
}
