import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../../components/movie-card.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Search & Filter Header -->
      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 class="text-3xl font-bold text-white border-l-4 border-cinema-red pl-4">All Movies</h1>
        
        <div class="relative w-full md:w-96">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (input)="filterMovies()"
            placeholder="Search movies..." 
            class="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 px-6 focus:outline-none focus:border-cinema-red focus:ring-1 focus:ring-cinema-red transition"
          >
          <span class="absolute right-4 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <!-- Movies Grid -->
      <div *ngIf="loading" class="text-center text-white py-12">Loading movies...</div>

      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <app-movie-card *ngFor="let movie of filteredMovies" [movie]="movie"></app-movie-card>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredMovies.length === 0" class="text-center py-16">
        <p class="text-gray-400 text-xl">No movies found matching "{{searchQuery}}"</p>
      </div>
    </div>
  `
})
export class MoviesComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  searchQuery = '';
  loading = true;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  filterMovies() {
    if (!this.searchQuery) {
      this.filteredMovies = this.movies;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredMovies = this.movies.filter(movie =>
        movie.title.toLowerCase().includes(query) ||
        movie.genre.some((g: string) => g.toLowerCase().includes(query))
      );
    }
  }
}
