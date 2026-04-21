import { Injectable } from '@angular/core';
import { User } from '../models/user';

interface RegisteredUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey: string = 'parksmart_user';

  private registeredUsers: RegisteredUser[] = [
    {
      id: 'u01',
      fullName: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      token: 'fake-token-u01'
    }
  ];

  login(email: string, password: string): boolean {
    const found = this.registeredUsers.find(
      u => u.email === email && u.password === password
    );
    if (!found) return false;
    const user: User = { id: found.id, fullName: found.fullName, email: found.email, token: found.token };
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    return true;
  }

  register(fullName: string, email: string, password: string): boolean {
    const exists = this.registeredUsers.some(u => u.email === email);
    if (exists) return false;
    const newUser: RegisteredUser = {
      id: 'u' + Date.now(),
      fullName,
      email,
      password,
      token: 'fake-token-' + Date.now()
    };
    this.registeredUsers.push(newUser);
    const user: User = { id: newUser.id, fullName: newUser.fullName, email: newUser.email, token: newUser.token };
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    return true;
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
