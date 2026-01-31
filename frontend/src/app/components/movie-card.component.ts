import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="relative group w-full rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-cinema-red/30 hover:-translate-y-2">
      <!-- Poster Image Wrapper with Fixed Aspect Ratio -->
      <div class="relative aspect-[2/3] w-full overflow-hidden">
        <img [src]="movie.posterUrl || 'assets/images/no-poster.svg'" 
             [alt]="movie.title" 
             (error)="onImageError($event)"
             class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-sm">
        
        <!-- Badges (Top Left) -->
        <div class="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
             <span *ngIf="movie.status === 'COMING_SOON'" class="bg-yellow-500/90 text-black text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider backdrop-blur-sm">Coming Soon</span>
             <span *ngIf="movie.certificate" class="bg-white/90 text-black text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wider backdrop-blur-sm w-fit">{{movie.certificate}}</span>
             <span *ngIf="isFormatsArray(movie.formats)" class="flex gap-1">
                <span *ngFor="let fmt of movie.formats" class="bg-cinema-red/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md backdrop-blur-sm">{{fmt}}</span>
             </span>
        </div>

        <!-- Dark Gradient Overlay (Always visible but stronger on hover) -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-90"></div>

        <!-- Hover Actions Overlay (Reveals on Hover) -->
        <div class="absolute inset-0 flex flex-col items-center justify-end pb-8 px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 translate-y-4 group-hover:translate-y-0">
           
           <div class="mb-6 text-center w-full">
             <span class="text-yellow-400 font-bold text-3xl flex items-center justify-center gap-2 drop-shadow-md mb-2" *ngIf="movie.status !== 'COMING_SOON'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                {{movie.rating || 0}}/10
             </span>
             <span class="text-white font-bold text-lg block mb-1" *ngIf="movie.status === 'COMING_SOON'">{{movie.releaseDate | date:'mediumDate'}}</span>
             <p class="text-gray-300 text-sm line-clamp-2 px-2">{{movie.genre.join(' • ')}}</p>
           </div>

           <div class="flex flex-col gap-3 w-full">
              <a *ngIf="movie.status !== 'COMING_SOON'" [routerLink]="['/movie', movie.slug || movie.id, 'book']" class="w-full bg-gradient-to-r from-cinema-red to-red-700 text-white py-3 rounded-lg font-bold text-center uppercase tracking-wide cursor-pointer hover:brightness-110 transition shadow-lg shadow-red-900/40 transform active:scale-95">
                Book Now
              </a>
              
              <button *ngIf="movie.status === 'COMING_SOON'" class="w-full bg-gray-700/50 backdrop-blur text-gray-400 py-3 rounded-lg font-bold text-center uppercase tracking-wide cursor-not-allowed border border-white/10">
                Releasing Soon
              </button>

              <a [routerLink]="['/movie', movie.slug || movie.id]" class="w-full bg-transparent border border-white/30 text-white py-3 rounded-lg font-bold text-center uppercase tracking-wide hover:bg-white/10 transition backdrop-blur-md">
                View Details
              </a>
           </div>
        </div>
      </div>

      <!-- Card Info (Visible when not hovering/Base state) -->
      <div class="p-4 bg-[#141414] relative z-20 border-t border-white/5 h-[100px] flex flex-col justify-between group-hover:bg-[#0A0A0A] transition-colors duration-300">
        <div>
          <h3 class="text-lg font-bold text-white truncate mb-1 group-hover:text-cinema-red transition-colors">{{movie.title}}</h3>
          <div class="flex items-center text-xs text-gray-400 gap-2 truncate">
             <span>{{getLanguages(movie.language)}}</span>
             <span class="w-1 h-1 rounded-full bg-gray-600"></span>
             <span>{{movie.genre?.slice(0, 2).join(', ')}}</span>
          </div>
        </div>
        
        <div class="flex justify-between items-center mt-2 border-t border-white/5 pt-2">
           <div class="flex items-center gap-1 text-xs font-medium text-gray-300" *ngIf="movie.duration">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{movie.duration}} min</span>
           </div>
           <span *ngIf="movie.certificate" class="text-[10px] border border-gray-600 rounded px-1 text-gray-400">{{movie.certificate}}</span>
        </div>
      </div>
    </div>
  `
})
export class MovieCardComponent {
  @Input() movie: any;

  isFormatsArray(formats: any): boolean {
    return Array.isArray(formats) && formats.length > 0;
  }

  getLanguages(language: any): string {
    if (Array.isArray(language)) {
      return language.join(', ');
    }
    return language || '';
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/no-poster.svg';
  }
}
