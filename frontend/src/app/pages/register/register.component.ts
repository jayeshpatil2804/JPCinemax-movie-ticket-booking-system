import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="mb-4">
              <label for="name" class="sr-only">Full Name</label>
              <input id="name" type="text" formControlName="name" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-cinema-red focus:border-cinema-red focus:z-10 sm:text-sm" placeholder="Full Name">
            </div>
            <div class="mb-4">
              <label for="email-address" class="sr-only">Email address</label>
              <input id="email-address" type="email" formControlName="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-cinema-red focus:border-cinema-red focus:z-10 sm:text-sm" placeholder="Email address">
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input id="password" type="password" formControlName="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-cinema-red focus:border-cinema-red focus:z-10 sm:text-sm" placeholder="Password">
            </div>
          </div>

          <div>
            <button type="submit" [disabled]="registerForm.invalid || loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-cinema-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cinema-red disabled:opacity-50 transition">
              <span *ngIf="loading">Creating Account...</span>
              <span *ngIf="!loading">Register</span>
            </button>
          </div>

          <div *ngIf="error" class="text-red-500 text-center text-sm mt-2">
            {{ error }}
          </div>
          
           <div class="text-center mt-4 text-sm">
              Already have an account? <a routerLink="/login" class="text-cinema-red hover:underline">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.loading = true;
            this.error = '';
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/']);
                    this.loading = false;
                },
                error: (err) => {
                    this.error = err.error?.message || 'Registration failed';
                    this.loading = false;
                }
            });
        }
    }
}
