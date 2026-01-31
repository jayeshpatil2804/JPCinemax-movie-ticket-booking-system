import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovieService } from '../../../../services/movie.service';

@Component({
  selector: 'app-admin-movies',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
     <div class="space-y-6 animate-fade-in">
         <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">Movie Management</h2>
            <button (click)="showForm = !showForm" class="bg-cinema-red hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-red-900/20">
               {{ showForm ? 'Cancel' : '+ Add Movie' }}
            </button>
         </div>

         <!-- Add Movie Form -->
         <div *ngIf="showForm" class="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
            <form [formGroup]="movieForm" (ngSubmit)="onSubmit()" class="space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Movie Title</label>
                     <input type="text" formControlName="title" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white placeholder-gray-600">
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Poster URL</label>
                     <input type="text" formControlName="posterUrl" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white placeholder-gray-600">
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Genre (comma separated)</label>
                     <input type="text" formControlName="genre" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white placeholder-gray-600">
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Duration (min)</label>
                     <input type="number" formControlName="duration" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white placeholder-gray-600">
                  </div>
                  <div class="space-y-2">
                       <label class="text-sm font-medium text-gray-400">Language</label>
                       <input type="text" formControlName="language" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white">
                  </div>
                  <div class="space-y-2">
                       <label class="text-sm font-medium text-gray-400">Rating (0-10)</label>
                       <input type="number" formControlName="rating" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white">
                  </div>
               </div>
               <div class="space-y-2">
                   <label class="text-sm font-medium text-gray-400">Description</label>
                   <textarea formControlName="description" rows="3" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white"></textarea>
               </div>
               
               <div class="flex justify-end pt-4">
                  <button type="submit" [disabled]="movieForm.invalid" class="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-50 transition">Save Movie</button>
               </div>
            </form>
         </div>

         <!-- Movie List -->
         <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
             <table class="w-full text-left">
                <thead class="bg-black/40 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                   <tr>
                      <th class="px-6 py-4">Title</th>
                      <th class="px-6 py-4">Genre</th>
                      <th class="px-6 py-4">Duration</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                   <tr *ngFor="let movie of movies" class="hover:bg-gray-800/50 transition">
                      <td class="px-6 py-4 font-medium text-white">{{movie.title}}</td>
                      <td class="px-6 py-4 text-gray-400">{{movie.genre.join(', ')}}</td>
                      <td class="px-6 py-4 text-gray-400">{{movie.duration}} min</td>
                      <td class="px-6 py-4 text-right space-x-3">
                         <button (click)="editMovie(movie)" class="text-blue-400 hover:text-blue-300 transition text-sm font-medium">Edit</button>
                         <button (click)="deleteMovie(movie._id)" class="text-red-500 hover:text-red-400 transition text-sm font-medium">Delete</button>
                      </td>
                   </tr>
                </tbody>
             </table>
         </div>
     </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AdminMoviesComponent implements OnInit {
  movies: any[] = [];
  showForm = false;
  movieForm: FormGroup;
  editingId: string | null = null;

  constructor(private movieService: MovieService, private fb: FormBuilder) {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      genre: ['', Validators.required],
      language: ['', Validators.required],
      duration: [120, Validators.required],
      posterUrl: ['', Validators.required],
      rating: [0],
      releaseDate: [new Date()]
    });
  }

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe((data: any[]) => this.movies = data);
  }

  onSubmit() {
    if (this.movieForm.valid) {
      const formValue = this.movieForm.value;
      const payload = {
        ...formValue,
        genre: typeof formValue.genre === 'string' ? formValue.genre.split(',').map((g: string) => g.trim()) : formValue.genre
      };

      if (this.editingId) {
        this.movieService.updateMovie(this.editingId, payload).subscribe(() => {
          this.resetForm();
          this.loadMovies();
        });
      } else {
        this.movieService.createMovie(payload).subscribe(() => {
          this.resetForm();
          this.loadMovies();
        });
      }
    }
  }

  editMovie(movie: any) {
    this.editingId = movie._id;
    this.showForm = true;
    this.movieForm.patchValue({
      ...movie,
      genre: movie.genre.join(', ')
    });
  }

  deleteMovie(id: string) {
    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(id).subscribe(() => this.loadMovies());
    }
  }

  resetForm() {
    this.showForm = false;
    this.editingId = null;
    this.movieForm.reset({ duration: 120, rating: 0, releaseDate: new Date() });
  }
}
