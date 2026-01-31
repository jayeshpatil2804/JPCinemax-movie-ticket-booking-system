import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ShowService } from '../../services/show.service';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-movie-details',
   standalone: true,
   imports: [CommonModule, FormsModule],
   template: `
    <div *ngIf="movie" class="bg-black text-white min-h-screen">
       <!-- Movie Info Header (Backdrop) -->
       <div class="relative h-[70vh] w-full bg-cover bg-top" 
           [style.backgroundImage]="'url(' + (movie.posterUrl || 'https://via.placeholder.com/1920x600') + ')'">
          <div class="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/80 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/50 to-transparent"></div>
          
          <div class="absolute bottom-0 left-0 right-0 container-custom pb-16 flex flex-col md:flex-row items-end gap-12">
             <!-- Poster -->
             <div class="hidden md:block w-72 h-[420px] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 relative z-10 transform translate-y-16">
                 <img [src]="movie.posterUrl || 'https://via.placeholder.com/300x450'" [alt]="movie.title" 
                      class="w-full h-full object-cover">
             </div>
             
             <!-- Details -->
             <div class="flex-1 mb-6 relative z-10">
                <div class="flex items-center gap-3 mb-4">
                     <span class="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">IMAX</span>
                     <span class="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded text-sm">{{movie.language}}</span>
                     <span class="text-gray-400 text-sm">• {{movie.duration}} min</span>
                </div>

                <h1 class="text-4xl md:text-6xl font-black mb-4 drop-shadow-2xl leading-tight text-white">{{movie.title}}</h1>
                
                <div class="flex flex-wrap items-center gap-6 text-sm mb-8">
                   <div class="flex items-center gap-2">
                       <span class="text-yellow-400 text-xl">★</span>
                       <span class="font-bold text-lg">{{movie.rating}}/10</span>
                       <span class="text-gray-500">Rating</span>
                   </div>
                   <div class="h-4 w-px bg-gray-700"></div>
                   <div class="text-gray-300">
                       {{movie.genre.join(', ')}}
                   </div>
                </div>
                
                <p class="text-gray-300 text-lg max-w-2xl leading-relaxed mb-8 line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
                    {{movie.description}}
                </p>
                
                <div class="flex gap-4">
                     <button (click)="scrollToShows()" class="btn-primary flex items-center gap-2 shadow-red-glow">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" /></svg>
                        Get Tickets
                     </button>
                     <button class="btn-outline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                        Watch Trailer
                     </button>
                </div>
             </div>
          </div>
       </div>

       <div class="container-custom py-20 flex flex-col md:flex-row gap-12" id="shows-section">
           <!-- Left Column: Shows -->
           <div class="flex-1">
              <h3 class="text-2xl font-bold mb-8 flex items-center">
                 <span class="w-1 h-8 bg-cinema-red mr-3 rounded-full"></span>
                 Select Show Date & Time
              </h3>

              <div *ngIf="loadingShows" class="py-12 text-center text-gray-500 animate-pulse">Checking availability...</div>
              
              <div *ngIf="!loadingShows && shows.length === 0" class="py-12 text-center bg-gray-900/50 rounded-2xl border border-gray-800 border-dashed">
                 <p class="text-gray-400 text-lg">No shows scheduled currently.</p>
              </div>

              <!-- Date Selector -->
              <div *ngIf="shows.length > 0" class="mb-10">
                 <div class="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                     <button *ngFor="let date of uniqueDates" 
                             (click)="selectedDate = date"
                             [class.bg-cinema-red]="selectedDate === date"
                             [class.text-white]="selectedDate === date"
                             [class.bg-gray-800]="selectedDate !== date"
                             [class.text-gray-400]="selectedDate !== date"
                             class="flex-shrink-0 w-20 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center border border-transparent hover:border-cinema-red/50">
                        <span class="text-xs font-semibold uppercase tracking-wider mb-1">{{date | date:'EEE'}}</span>
                        <span class="text-2xl font-black">{{date | date:'dd'}}</span>
                        <span class="text-xs">{{date | date:'MMM'}}</span>
                     </button>
                 </div>
              </div>

              <!-- Cinema List -->
              <div class="space-y-6">
                 <div *ngFor="let cinema of getCinemasForDate(selectedDate)" class="bg-gray-900/40 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                       <div>
                          <h4 class="text-white font-bold text-lg mb-1 flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                             {{cinema.name}}
                          </h4>
                          <p class="text-gray-500 text-sm ml-7">{{cinema.location}}</p>
                       </div>
                       <div class="flex gap-2">
                          <span class="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded border border-green-500/20">M-Ticket</span>
                          <span class="px-2 py-1 bg-orange-500/10 text-orange-500 text-xs rounded border border-orange-500/20">F&B</span>
                       </div>
                    </div>
                    
                    <div class="flex flex-wrap gap-4">
                       <button *ngFor="let show of cinema.shows" 
                               (click)="bookShow(show._id)"
                               class="group relative px-6 py-3 rounded-xl border border-gray-700 bg-gray-800 hover:bg-white hover:border-white transition-all duration-300 overflow-hidden">
                           <span class="relative z-10 text-sm font-bold text-gray-300 group-hover:text-black transition-colors">{{show.startTime | date:'shortTime'}}</span>
                           <div class="absolute inset-x-0 bottom-0 h-1 bg-cinema-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Right Column: Cast/Crew (Desktop only) -->
           <div class="w-full md:w-80 lg:w-96">
                <!-- Cast -->
                <div class="mb-8" *ngIf="movie.cast?.length">
                   <h3 class="text-lg font-bold text-gray-400 mb-6 uppercase tracking-wider">Cast</h3>
                   <div class="grid grid-cols-1 gap-4">
                       <div *ngFor="let actor of movie.cast" class="flex items-center gap-4 group cursor-pointer">
                          <div class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 group-hover:border-cinema-red transition">
                              <img *ngIf="actor.imageUrl" [src]="actor.imageUrl" [alt]="actor.name" (error)="onActorImageError($event)" class="w-full h-full object-cover">
                              <span *ngIf="!actor.imageUrl" class="text-xs text-gray-500">{{actor.name.charAt(0)}}</span>
                          </div>
                          <div>
                              <div class="text-gray-300 group-hover:text-white transition font-bold">{{actor.name}}</div>
                              <div class="text-xs text-gray-500">{{actor.role}}</div>
                          </div>
                       </div>
                   </div>
                </div>

                <!-- Crew -->
                <div *ngIf="movie.crew?.length">
                   <h3 class="text-lg font-bold text-gray-400 mb-6 uppercase tracking-wider">Crew</h3>
                   <div class="flex flex-col gap-4">
                       <div *ngFor="let c of movie.crew" class="flex items-center gap-4 group">
                          <div class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
                              <img *ngIf="c.imageUrl" [src]="c.imageUrl" [alt]="c.name" (error)="onActorImageError($event)" class="w-full h-full object-cover">
                              <span *ngIf="!c.imageUrl" class="text-xs text-gray-500">{{c.name.charAt(0)}}</span>
                          </div>
                          <div>
                              <div class="text-gray-300 text-sm font-bold">{{c.name}}</div>
                              <div class="text-xs text-gray-500">{{c.role}}</div>
                          </div>
                       </div>
                   </div>
                </div>
           </div>
       </div>
    </div>
  `,
   styles: [`
    .shadow-red-glow { box-shadow: 0 0 20px rgba(229, 9, 20, 0.5); }
  `]
})
export class MovieDetailsComponent implements OnInit {
   movie: any;
   shows: any[] = [];
   loadingShows = false;

   uniqueDates: string[] = [];
   selectedDate: string | null = null;

   constructor(
      private route: ActivatedRoute,
      private router: Router,
      private movieService: MovieService,
      private showService: ShowService
   ) { }

   ngOnInit() {
      // Subscribe to route params to handle slug changes
      this.route.paramMap.subscribe(params => {
         const slug = params.get('id');
         if (slug) {
            this.getMovieDetails(slug);
         }
      });

      // Auto-scroll logic handled after data load or via flag
   }

   scrollToShows() {
      document.getElementById('shows-section')?.scrollIntoView({ behavior: 'smooth' });
   }

   getMovieDetails(slug: string) {
      this.movieService.getMovieById(slug).subscribe({
         next: (data) => {
            this.movie = data;
            // Once we have movie data, we get its ID to fetch shows
            if (this.movie && this.movie._id) {
               this.getShows(this.movie._id);
            }
         },
         error: (err) => console.error('Error fetching movie:', err)
      });
   }

   getShows(movieId: string) {
      this.loadingShows = true;
      this.showService.getShows({ movie: movieId }).subscribe({
         next: (data) => {
            this.shows = data;
            this.processShows();
            this.loadingShows = false;
         },
         error: () => this.loadingShows = false
      });
   }

   processShows() {
      // Group by Date for Date Selector
      const dates = new Set(this.shows.map(s => {
         const d = new Date(s.startTime);
         return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
      }));
      this.uniqueDates = Array.from(dates).sort();
      if (this.uniqueDates.length > 0 && !this.selectedDate) {
         this.selectedDate = this.uniqueDates[0];
      }
   }

   getCinemasForDate(dateStr: string | null) {
      if (!dateStr) return [];
      const targetDate = new Date(dateStr);

      // Filter shows by date
      const showsOnDate = this.shows.filter(s => {
         const d = new Date(s.startTime);
         return d.getFullYear() === targetDate.getFullYear() &&
            d.getMonth() === targetDate.getMonth() &&
            d.getDate() === targetDate.getDate();
      });

      // Group by Cinema
      const cinemasMap = new Map();
      showsOnDate.forEach(show => {
         if (!cinemasMap.has(show.cinema._id)) {
            cinemasMap.set(show.cinema._id, {
               name: show.cinema.name,
               location: show.cinema.location,
               shows: []
            });
         }
         cinemasMap.get(show.cinema._id).shows.push(show);
      });

      return Array.from(cinemasMap.values());
   }

   bookShow(showId: string) {
      this.router.navigate(['/select-seats', showId]);
   }

   onActorImageError(event: any) {
      event.target.src = 'https://ui-avatars.com/api/?name=Unknown&background=random';
   }
}
