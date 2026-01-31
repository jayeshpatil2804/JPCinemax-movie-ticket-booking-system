import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../movie-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-now-showing',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, RouterLink],
  template: `
    <section class="py-16 bg-cinema-dark relative">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
          <div class="mb-4 md:mb-0">
            <h2 class="text-3xl md:text-4xl font-black text-white border-l-4 border-cinema-red pl-4 tracking-tight">Now Showing</h2>
            <p class="text-gray-400 mt-2 ml-5">Watch the latest blockbusters experiences.</p>
          </div>
          <a routerLink="/movies" class="text-cinema-red hover:text-white transition font-bold uppercase tracking-wider text-sm flex items-center group">
            View All Movies <span class="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <app-movie-card *ngFor="let movie of movies" [movie]="movie" class="w-full"></app-movie-card>
        </div>
        
        <div *ngIf="movies.length === 0" class="text-center text-gray-500 py-20 bg-white/5 rounded-xl border border-white/5">
            <p class="text-xl">No movies currently showing.</p>
        </div>
      </div>
    </section>
  `
})
export class NowShowingComponent {
  @Input() movies: any[] = [];
}
