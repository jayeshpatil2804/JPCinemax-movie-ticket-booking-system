import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative h-[calc(100vh-72px)] w-full overflow-hidden group" *ngIf="movies.length > 0">
      <!-- Slides -->
      <div *ngFor="let movie of movies; let i = index" 
           class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
           [class.opacity-100]="currentSlide === i"
           [class.opacity-0]="currentSlide !== i">
        
        <!-- Background Image (Cinema Fullscreen) -->
        <div class="absolute inset-0 bg-cover bg-top transform transition-transform duration-[10000ms] ease-linear will-change-transform"
             [style.backgroundImage]="'url(' + (movie.heroImageUrl || movie.bannerUrl || movie.posterUrl) + ')'"
             [class.scale-110]="currentSlide === i"
             [class.scale-100]="currentSlide !== i">
        </div>

        <!-- Gradient Overlay (Gradient to Black at bottom and left) -->
        <div class="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/50 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/80 to-transparent"></div>

        <!-- Content -->
        <div class="absolute inset-0 flex items-center container-custom">
          <div class="max-w-3xl text-white pl-4 md:pl-0 pt-20">
            <span class="inline-block px-3 py-1 bg-cinema-red text-white text-xs font-bold uppercase tracking-widest mb-4 rounded-sm animate-fade-in-up">
                Now Showing
            </span>
            <h1 class="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-none animate-fade-in-up delay-100 drop-shadow-2xl uppercase">
              {{movie.title}}
            </h1>
            <div class="flex items-center space-x-4 text-gray-300 mb-8 animate-fade-in-up delay-200">
                <span class="px-2 py-1 border border-white/20 rounded text-xs">{{getLanguages(movie.language)}}</span>
                <span class="px-2 py-1 border border-white/20 rounded text-xs">{{movie.rating}}</span>
                <span>{{movie.genre.join(', ')}}</span>
                <span>• {{movie.duration}} min</span>
            </div>
            <p class="text-lg md:text-xl text-gray-400 mb-10 font-light max-w-xl leading-relaxed animate-fade-in-up delay-200 line-clamp-3">
              {{movie.description}}
            </p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up delay-300">
              <a [routerLink]="['/movie', movie.slug || movie._id]" class="btn-primary text-center px-8 py-4 text-lg">
                Book Tickets
              </a>
              <button class="btn-outline text-center px-8 py-4 text-lg">
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Indicators -->
      <div class="absolute bottom-12 right-12 flex space-x-3 z-20">
        <button *ngFor="let movie of movies; let i = index"
                (click)="goToSlide(i)"
                class="h-1 rounded-full transition-all duration-300"
                [class.bg-cinema-red]="currentSlide === i"
                [class.w-8]="currentSlide === i"
                [class.w-4]="currentSlide !== i"
                [class.bg-gray-600]="currentSlide !== i">
        </button>
      </div>

      <!-- Navigation Arrows (Optional, visible on hover) -->
      <button (click)="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-cinema-red p-3 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button (click)="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-cinema-red p-3 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-20">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  `,
  styles: []
})
export class HeroSliderComponent implements OnInit, OnDestroy, OnChanges {
  @Input() movies: any[] = [];
  currentSlide = 0;
  intervalId: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movies'] && this.movies.length > 0) {
      this.currentSlide = 0;
      this.stopTimer();
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prevSlide() {
    if (this.movies.length === 0) return;
    this.currentSlide = (this.currentSlide - 1 + this.movies.length) % this.movies.length;
    this.stopTimer();
    this.startTimer();
  }

  nextSlide() {
    if (this.movies.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.movies.length;
  }

  goToSlide(index: number) {
    this.currentSlide = index;
    this.stopTimer();
    this.startTimer();
  }

  getLanguages(language: any): string {
    if (Array.isArray(language)) {
      return language.join(', ');
    }
    return language || '';
  }
}
