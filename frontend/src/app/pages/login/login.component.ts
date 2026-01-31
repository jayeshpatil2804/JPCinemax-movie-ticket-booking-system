import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="mb-4">
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" type="email" formControlName="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-cinema-red focus:border-cinema-red focus:z-10 sm:text-sm" placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" type="password" formControlName="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cinema-red focus:border-cinema-red focus:z-10 sm:text-sm" placeholder="Password">
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-cinema-red focus:ring-cinema-red border-gray-300 rounded">
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-cinema-red hover:text-red-700">Forgot your password?</a>
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cinema-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-red disabled:opacity-50 transition">
              <span *ngIf="loading">Signing in...</span>
              <span *ngIf="!loading">Sign in</span>
            </button>
          </div>
          
          <div *ngIf="error" class="text-red-500 text-center text-sm mt-2">
            {{ error }}
          </div>

          <div class="text-center mt-4 text-sm">
              Don't have an account? <a routerLink="/register" class="text-cinema-red hover:underline">Register here</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
    loginForm: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            this.error = '';
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err.error?.message || 'Login failed';
                    this.loading = false;
                }
            });
        }
    }
}
