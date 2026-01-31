import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
   selector: 'app-booking-success',
   standalone: true,
   imports: [CommonModule, RouterModule, DatePipe, CurrencyPipe],
   template: `
    <div class="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <!-- Ambient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black pointer-events-none"></div>
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-cinema-red/10 blur-[100px] pointer-events-none"></div>

      <!-- Ticket Container -->
      <div class="relative z-10 w-full max-w-md animate-ticket-slide-up">
        
        <!-- Success Checkmark -->
        <div class="flex justify-center mb-6">
            <div class="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.6)]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
            </div>
        </div>
        
        <h1 class="text-3xl font-bold text-center mb-1 text-white text-shadow-glow">Booking Confirmed</h1>
        <p class="text-center text-gray-400 text-sm mb-8">Your ticket has been sent to your email</p>

        <!-- The Ticket -->
        <div class="bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative">
            
            <!-- Perforated Top (Visual) -->
            <div class="absolute -left-3 top-32 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>
            <div class="absolute -right-3 top-32 w-6 h-6 bg-[#0a0a0a] rounded-full"></div>
            <div class="absolute top-35 left-4 right-4 border-b-2 border-dashed border-gray-300"></div>

            <!-- Movie Image & Header -->
            <div class="relative h-32 bg-gray-900 overflow-hidden">
                <img [src]="booking?.show?.movie?.heroImageUrl || booking?.show?.movie?.posterUrl" class="w-full h-full object-cover opacity-60">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div class="absolute bottom-4 left-6 text-white">
                    <h2 class="text-2xl font-bold leading-none mb-1">{{booking?.show?.movie?.title}}</h2>
                    <p class="text-xs text-gray-300 uppercase tracking-wider">{{booking?.show?.cinema?.name}}</p>
                </div>
            </div>

            <!-- Ticket Body -->
            <div class="p-6 pt-8">
                <div class="flex justify-between items-center mb-6">
                    <div class="text-center">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</p>
                        <p class="text-lg font-bold">{{booking?.show?.startTime | date:'d MMM'}}</p>
                    </div>
                     <div class="text-center">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Time</p>
                        <p class="text-lg font-bold">{{booking?.show?.startTime | date:'shortTime'}}</p>
                    </div>
                     <div class="text-center">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Screen</p>
                        <p class="text-lg font-bold">{{booking?.show?.screenNumber || 1}}</p>
                    </div>
                </div>

                <div class="bg-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
                    <div class="flex justify-between items-start">
                        <div>
                             <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Seats ({{booking?.seats?.length}})</p>
                             <div class="flex flex-wrap gap-1">
                                 <span *ngFor="let seat of booking?.seats" class="bg-black text-white text-xs font-bold px-2 py-1 rounded">
                                     {{seat.row}}{{seat.number}}
                                 </span>
                             </div>
                        </div>
                         <div class="text-right">
                             <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                             <p class="text-xl font-bold text-cinema-red">{{booking?.totalPrice | currency:'INR'}}</p>
                        </div>
                    </div>
                </div>

                <!-- QR Code Section -->
                <div class="flex flex-col items-center justify-center">
                    <div class="bg-white p-2 border-2 border-gray-200 rounded-xl mb-2">
                        <img [src]="qrCodeUrl" alt="Booking QR" class="w-32 h-32">
                    </div>
                    <p class="text-xs text-gray-400 font-mono tracking-widest">{{booking?.bookingId}}</p>
                </div>
            </div>

            <!-- Ticket Footer -->
            <div class="bg-gray-900 p-4 text-center">
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Show this ticket at the entrance</p>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex flex-col gap-3">
            <button routerLink="/my-bookings" class="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-4 rounded-xl font-bold transition backdrop-blur-md flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                View My Bookings
            </button>
            <button routerLink="/" class="text-gray-500 hover:text-white text-sm transition py-2">Back to Home</button>
        </div>

      </div>
    </div>
  `,
   styles: [`
    .animate-ticket-slide-up { animation: ticketSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes ticketSlideUp {
        from { opacity: 0; transform: translateY(50px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class BookingSuccessComponent implements OnInit {
   booking: any;
   qrCodeUrl: string = '';

   constructor(private router: Router) {
      const nav = this.router.getCurrentNavigation();
      if (nav?.extras.state?.['booking']) {
         this.booking = nav.extras.state['booking'];
         this.generateQR();
      } else {
         // Should navigate away, but keeping for dev safety
      }
   }

   ngOnInit() { }

   generateQR() {
      // Create a rich QR data object
      const qrData = JSON.stringify({
         id: this.booking.bookingId,
         movie: this.booking.show?.movie?.title,
         seats: this.booking.seats?.map((s: any) => `${s.row}${s.number}`).join(','),
         cinema: this.booking.show?.cinema?.name
      });
      // Use API to generate QR
      this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
   }
}
