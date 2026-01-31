import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-cinema-dark/95 backdrop-blur-md border-b border-white/10 shadow-lg">
      <div class="container-custom">
        <div class="flex justify-between items-center h-[72px]">
          <!-- Logo -->
          <a routerLink="/" class="text-3xl font-black tracking-tighter text-white flex items-center group">
            <span class="text-cinema-red group-hover:scale-110 transition-transform duration-300">M</span>IRAJ
            <span class="ml-2 text-xs font-normal tracking-widest text-gray-400 opacity-50 border-l border-gray-600 pl-2">CINEMAS</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center space-x-1">
            <a routerLink="/" 
               routerLinkActive="text-white bg-white/10" 
               [routerLinkActiveOptions]="{exact: true}" 
               class="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
               Home
            </a>
            <a routerLink="/movies" 
               routerLinkActive="text-white bg-white/10" 
               class="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
               Movies
            </a>
            <a routerLink="/cinemas" 
               routerLinkActive="text-white bg-white/10" 
               class="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
               Cinemas
            </a>
             <a routerLink="/about" 
               routerLinkActive="text-white bg-white/10" 
               class="px-5 py-2 rounded-full text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all">
               About Us
            </a>
          </div>

          <!-- Auth / Mobile Menu -->
          <div class="flex items-center space-x-4">
            <ng-container *ngIf="user$ | async as user; else guest">
                <div class="flex items-center space-x-4">
                     <div class="hidden md:flex flex-col items-end mr-2">
                        <span class="text-sm font-bold text-white leading-none">{{user.name}}</span>
                        <span class="text-[10px] text-gray-400 uppercase tracking-wider">Member</span>
                     </div>
                     
                     <button  *ngIf="user.role === 'admin'" routerLink="/admin" class="hidden md:block text-xs bg-gray-800 border border-gray-700 px-3 py-1 rounded text-gray-300 hover:bg-gray-700 transition">
                        Admin
                     </button>
                     
                     <button (click)="logout()" class="text-gray-400 hover:text-cinema-red transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                     </button>
                </div>
            </ng-container>
            <ng-template #guest>
              <div class="flex items-center space-x-3">
                  <a routerLink="/login" class="px-4 py-2 border border-white/20 rounded-full text-sm font-bold text-white hover:bg-white/10 transition uppercase tracking-wide">Login</a>
                  <a routerLink="/register" class="bg-cinema-red text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-900/20 hover:bg-red-700 hover:shadow-red-900/40 transition-all transform hover:-translate-y-0.5 uppercase tracking-wide">
                    Register
                  </a>
              </div>
            </ng-template>

            <!-- Mobile Menu Button -->
            <button class="md:hidden text-white focus:outline-none" (click)="toggleMobileMenu()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Dropdown -->
      <div *ngIf="mobileMenuOpen" class="md:hidden bg-cinema-dark border-t border-gray-800 animate-fade-in-down">
         <div class="px-4 py-6 space-y-4">
            <a routerLink="/" (click)="mobileMenuOpen=false" class="block text-gray-300 hover:text-white font-medium text-lg">Home</a>
            <a routerLink="/movies" (click)="mobileMenuOpen=false" class="block text-gray-300 hover:text-white font-medium text-lg">Movies</a>
            <a routerLink="/cinemas" (click)="mobileMenuOpen=false" class="block text-gray-300 hover:text-white font-medium text-lg">Cinemas</a>
            <a routerLink="/about" (click)="mobileMenuOpen=false" class="block text-gray-300 hover:text-white font-medium text-lg">About Us</a>
            <div class="pt-4 border-t border-gray-700" *ngIf="(user$ | async) === null">
                 <a routerLink="/login" (click)="mobileMenuOpen=false" class="block text-white font-bold mb-3">Login</a>
                 <a routerLink="/register" (click)="mobileMenuOpen=false" class="block text-center bg-cinema-red text-white py-3 rounded-xl font-bold">Join Now</a>
            </div>
         </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  user$ = this.authService.user$;
  mobileMenuOpen = false;

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.mobileMenuOpen = false;
  }
}
