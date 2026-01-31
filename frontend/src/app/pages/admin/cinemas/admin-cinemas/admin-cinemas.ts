import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CinemaService } from '../../../../services/cinema.service';

@Component({
  selector: 'app-admin-cinemas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
     <div class="space-y-6 animate-fade-in">
         <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-white">Cinema Management</h2>
            <button (click)="showForm = !showForm" class="bg-cinema-red hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-lg shadow-red-900/20">
               {{ showForm ? 'Cancel' : '+ Add Cinema' }}
            </button>
         </div>

         <!-- Add Cinema Form -->
         <div *ngIf="showForm" class="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl">
            <form [formGroup]="cinemaForm" (ngSubmit)="onSubmit()" class="space-y-6">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Cinema Name</label>
                     <input type="text" formControlName="name" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white placeholder-gray-600">
                  </div>
                   <div class="space-y-2">
                     <label class="text-sm font-medium text-gray-400">Location</label>
                     <input type="text" formControlName="location" class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 focus:border-cinema-red focus:ring-1 focus:ring-cinema-red outline-none transition text-white placeholder-gray-600">
                  </div>
               </div>
               
               <div class="flex justify-end pt-4">
                  <button type="submit" [disabled]="cinemaForm.invalid" class="bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-50 transition">Save Cinema</button>
               </div>
            </form>
         </div>

         <!-- Cinema List -->
         <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
             <table class="w-full text-left">
                <thead class="bg-black/40 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                   <tr>
                      <th class="px-6 py-4">Name</th>
                      <th class="px-6 py-4">Location</th>
                      <th class="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody class="divide-y divide-gray-800">
                   <tr *ngFor="let cinema of cinemas" class="hover:bg-gray-800/50 transition">
                      <td class="px-6 py-4 font-medium text-white">{{cinema.name}}</td>
                      <td class="px-6 py-4 text-gray-400">{{cinema.location}}</td>
                      <td class="px-6 py-4 text-right">
                         <button (click)="deleteCinema(cinema._id)" class="text-red-500 hover:text-red-400 transition text-sm font-medium">Delete</button>
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
export class AdminCinemasComponent implements OnInit {
  cinemas: any[] = [];
  showForm = false;
  cinemaForm: FormGroup;

  constructor(private cinemaService: CinemaService, private fb: FormBuilder) {
    this.cinemaForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCinemas();
  }

  loadCinemas() {
    this.cinemaService.getCinemas().subscribe((data: any[]) => this.cinemas = data);
  }

  onSubmit() {
    if (this.cinemaForm.valid) {
      const payload = {
        ...this.cinemaForm.value,
        screens: [{ screenNumber: 1, seatLayout: [] }] // Default 1 screen
      };
      this.cinemaService.createCinema(payload).subscribe(() => {
        this.loadCinemas();
        this.showForm = false;
        this.cinemaForm.reset();
      });
    }
  }

  deleteCinema(id: string) {
    if (confirm('Are you sure?')) {
      this.cinemaService.deleteCinema(id).subscribe(() => this.loadCinemas());
    }
  }
}
