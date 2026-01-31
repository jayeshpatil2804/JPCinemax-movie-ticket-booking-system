import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../movie-card.component';

@Component({
  selector: 'app-upcoming',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  template: `
    <section class="py-16 bg-[#0B0B0B] border-t border-gray-800 relative overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute top-0 right-0 w-96 h-96 bg-cinema-red/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

      <div class="container-custom relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-12">
           <div class="mb-4 md:mb-0">
             <h2 class="text-3xl md:text-4xl font-black text-white border-l-4 border-yellow-500 pl-4 tracking-tight">Coming Soon</h2>
             <p class="text-gray-400 mt-2 ml-5">Get ready for the next big cinematic experiences.</p>
           </div>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           <app-movie-card *ngFor="let movie of movies" [movie]="movie" class="w-full grayscale hover:grayscale-0 transition-all duration-500"></app-movie-card>
        </div>

        <div *ngIf="movies.length === 0" class="text-center text-gray-500 py-20 bg-white/5 rounded-xl border border-white/5">
            <p class="text-xl">No upcoming movies announced yet.</p>
        </div>
      </div>
    </section>
  `
})
export class UpcomingComponent {
  @Input() movies: any[] = [];
}
