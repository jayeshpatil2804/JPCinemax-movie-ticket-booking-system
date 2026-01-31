import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-my-bookings',
    standalone: true,
    imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
    template: `
    <div class="min-h-screen bg-[#141414] py-12 px-4">
       <div class="container-custom mx-auto max-w-4xl">
          <h1 class="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <span class="w-1 h-8 bg-cinema-red rounded-full"></span>
              My Bookings
          </h1>

          <div *ngIf="loading" class="flex justify-center py-20">
              <div class="w-10 h-10 border-4 border-cinema-red border-t-transparent rounded-full animate-spin"></div>
          </div>

          <div *ngIf="!loading && bookings.length === 0" class="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-gray-800">
              <div class="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <h2 class="text-xl font-bold text-white mb-2">No bookings found</h2>
              <p class="text-gray-400 mb-6">You haven't booked any tickets yet.</p>
              <a routerLink="/" class="text-cinema-red hover:underline font-bold">Explore Movies</a>
          </div>

          <div *ngIf="!loading && bookings.length > 0" class="space-y-6">
              <div *ngFor="let booking of bookings" class="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col md:flex-row hover:border-gray-700 transition group">
                  
                  <!-- Poster -->
                  <div class="w-full md:w-32 h-40 md:h-auto bg-gray-800 relative flex-shrink-0">
                      <img [src]="booking.show?.movie?.posterUrl" class="w-full h-full object-cover">
                  </div>

                  <!-- Details -->
                  <div class="p-6 flex-1 flex flex-col justify-between">
                      <div>
                          <div class="flex justify-between items-start mb-2">
                             <h2 class="text-xl font-bold text-white group-hover:text-cinema-red transition">{{booking.show?.movie?.title}}</h2>
                             <span class="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded font-bold border border-green-500/20">
                                 {{booking.bookingId || 'CONFIRMED'}}
                             </span>
                          </div>
                          <p class="text-gray-400 text-sm mb-4">{{booking.show?.cinema?.name}}</p>
                          
                          <div class="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-300">
                              <div class="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                  {{booking.show?.startTime | date:'mediumDate'}}
                              </div>
                              <div class="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  {{booking.show?.startTime | date:'shortTime'}}
                              </div>
                              <div class="flex items-center gap-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                                  Seats: <span class="text-white font-bold">{{getSeats(booking)}}</span>
                              </div>
                          </div>
                      </div>

                      <div class="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                          <span class="text-gray-500 text-sm">Total Paid</span>
                          <span class="text-white font-bold">{{booking.totalPrice | currency:'INR'}}</span>
                      </div>
                  </div>
                  
                  <!-- QR Trigger (Optional) -->
                  <div class="hidden md:flex flex-col items-center justify-center p-6 bg-black/20 border-l border-gray-800 w-32">
                       <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=' + (booking.qrCode || booking.bookingId)" class="w-16 h-16 opacity-80 mb-2">
                       <span class="text-[10px] text-gray-500 uppercase tracking-widest text-center">Scan Entry</span>
                  </div>
              </div>
          </div>
       </div>
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
    bookings: any[] = [];
    loading = true;

    constructor(private bookingService: BookingService) { }

    ngOnInit() {
        this.bookingService.getMyBookings().subscribe({
            next: (data) => {
                this.bookings = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Failed to load bookings', err);
                this.loading = false;
            }
        });
    }

    getSeats(booking: any): string {
        return booking.seats.map((s: any) => `${s.row}${s.number}`).join(', ');
    }
}
