import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value as string;
  const confirmPassword = group.get('confirmPassword')?.value as string;
  return password === confirmPassword ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-auth',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class AuthComponent implements OnInit {
  isRegisterMode = false;
  errorMessage = '';

  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.registerForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordsMatch }
    );
  }

  ngOnInit(): void {
    const dataMode = this.route.snapshot.data['mode'] === 'register';
    this.route.queryParams.subscribe(params => {
      this.isRegisterMode = dataMode || params['mode'] === 'register';
    });
  }

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.isRegisterMode) {
      if (this.registerForm.invalid) return;
      const { fullName, email, password } = this.registerForm.value as {
        fullName: string;
        email: string;
        password: string;
      };
      this.authService.register(fullName, email, password).subscribe(result => {
        if (result.success) {
          this.router.navigate(['/list']);
        } else {
          this.errorMessage = result.error ?? 'Registration failed.';
        }
      });
    } else {
      if (this.loginForm.invalid) return;
      const { email, password } = this.loginForm.value as {
        email: string;
        password: string;
      };
      this.authService.login(email, password).subscribe(result => {
        if (result.success) {
          const user = this.authService.getCurrentUser();
          if (user?.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/list']);
          }
        } else {
          this.errorMessage = 'Invalid credentials.';
        }
      });
    }
  }
}
