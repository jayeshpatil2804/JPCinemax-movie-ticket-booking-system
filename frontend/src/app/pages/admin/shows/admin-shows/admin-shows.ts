import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShowService } from '../../../../services/show.service';
import { MovieService } from '../../../../services/movie.service';
import { CinemaService } from '../../../../services/cinema.service';

@Component({
  selector: 'app-admin-shows',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
     <div class="space-y-6 animate-fade-in">
         <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">Show Schedule</h2>
            <button (click)="isFormVisible = !isFormVisible" class="bg-cinema-red hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-red-900/20">
               {{ isFormVisible ? 'Cancel' : '+ Schedule Show' }}
            </button>
         </div>

         <!-- Add Show Form -->
         <div *ngIf="isFormVisible" class="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
            <form [formGroup]="showForm" (ngSubmit)="onSubmit()" class="space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Select Movie</label>
                     <select formControlName="movie" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white">
                        <option *ngFor="let m of movies" [value]="m._id">{{m.title}}</option>
                     </select>
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Select Cinema</label>
                     <select formControlName="cinema" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white">
                        <option *ngFor="let c of cinemas" [value]="c._id">{{c.name}} - {{c.location}}</option>
                     </select>
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Date & Time</label>
                     <input type="datetime-local" formControlName="startTime" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white">
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Screen Number</label>
                     <input type="number" formControlName="screenNumber" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white">
                  </div>
               </div>

               <div class="flex justify-end pt-4">
                  <button type="submit" [disabled]="showForm.invalid" class="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-50 transition">Publish Show</button>
               </div>
            </form>
         </div>

         <!-- Show List -->
         <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
             <table class="w-full text-left">
                <thead class="bg-black/40 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                   <tr>
                      <th class="px-6 py-4">Movie</th>
                      <th class="px-6 py-4">Cinema</th>
                      <th class="px-6 py-4">Time</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                    <tr *ngIf="shows.length === 0">
                        <td colspan="4" class="px-6 py-8 text-center text-gray-500">No shows scheduled yet.</td>
                    </tr>
                   <tr *ngFor="let show of shows" class="hover:bg-gray-800/50 transition">
                      <td class="px-6 py-4 font-medium text-white">{{show.movie?.title}}</td>
                      <td class="px-6 py-4 text-gray-400">{{show.cinema?.name}}</td>
                      <td class="px-6 py-4 text-gray-400">{{show.startTime | date:'short'}}</td>
                      <td class="px-6 py-4 text-right">
                         <button (click)="deleteShow(show._id)" class="text-red-500 hover:text-red-400 transition text-sm font-medium">Cancel</button>
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
export class AdminShowsComponent implements OnInit {
  shows: any[] = [];
  movies: any[] = [];
  cinemas: any[] = [];
  isFormVisible = false;
  showForm: FormGroup;

  constructor(
    private showService: ShowService,
    private movieService: MovieService,
    private cinemaService: CinemaService,
    private fb: FormBuilder
  ) {
    this.showForm = this.fb.group({
      movie: ['', Validators.required],
      cinema: ['', Validators.required],
      startTime: ['', Validators.required],
      screenNumber: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.loadShows();
    this.loadMovies();
    this.loadCinemas();
  }

  loadShows() {
    this.showService.getShows({}).subscribe((data: any[]) => this.shows = data);
  }

  loadMovies() {
    this.movieService.getMovies().subscribe((data: any[]) => this.movies = data);
  }

  loadCinemas() {
    this.cinemaService.getCinemas().subscribe((data: any[]) => this.cinemas = data);
  }

  onSubmit() {
    if (this.showForm.valid) {
      const formValue = this.showForm.value;
      const payload = {
        ...formValue,
        seats: this.generateDefaultSeats()
      };

      this.showService.createShow(payload).subscribe(() => {
        this.loadShows();
        this.isFormVisible = false;
        this.showForm.reset({ screenNumber: 1 });
      });
    }
  }

  deleteShow(id: string) {
    if (confirm('Are you sure?')) {
      this.showService.deleteShow(id).subscribe(() => this.loadShows());
    }
  }

  generateDefaultSeats() {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E'];
    for (const row of rows) {
      for (let i = 1; i <= 8; i++) {
        seats.push({
          row: row,
          number: i,
          type: row === 'E' ? 'Premium' : 'Standard',
          price: row === 'E' ? 300 : 200,
          isBooked: false
        });
      }
    }
    return seats;
  }
}
