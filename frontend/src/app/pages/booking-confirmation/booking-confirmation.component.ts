import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-booking-confirmation',
    standalone: true,
    imports: [CommonModule, RouterLink],

    template: `
    <div class="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4">
      <div class="max-w-md w-full animate-slide-up">
        
        <!-- Success Message -->
        <div class="text-center mb-8">
           <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
           </div>
           <h1 class="text-3xl font-bold">Booking Confirmed!</h1>
           <p class="text-gray-400 mt-2">Your tickets have been sent to your email.</p>
        </div>

        <!-- Ticket Card -->
        <div class="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl relative">
            <!-- Ticket Header -->
            <div class="bg-cinema-red p-6 text-center relative overflow-hidden">
                <div class="relative z-10">
                   <h2 class="text-2xl font-bold uppercase tracking-wider text-white">CinemaTik</h2>
                   <p class="text-white/80 text-sm">Admit One</p>
                </div>
                <div class="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            </div>

            <!-- Movie Details -->
            <div class="p-6 border-b border-gray-800 border-dashed relative">
                <h3 class="text-2xl font-bold mb-2">{{bookingData?.movieTitle || 'Avatar: The Way of Water'}}</h3>
                <p class="text-gray-400 text-sm mb-4">{{bookingData?.cinemaName || 'PVR Cinemas'}} | {{bookingData?.screen || 'Screen 1'}}</p>
                
                <div class="flex justify-between items-center mb-4">
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Date</p>
                        <p class="font-medium">{{ (bookingData?.date | date:'mediumDate') || 'Oct 24, 2025' }}</p>
                    </div>
                    <div class="text-right">
                         <p class="text-xs text-gray-500 uppercase">Time</p>
                         <p class="font-medium">{{ (bookingData?.date | date:'shortTime') || '07:30 PM' }}</p>
                    </div>
                </div>
                 <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xs text-gray-500 uppercase">Seats</p>
                        <p class="font-medium text-cinema-red">{{ bookingData?.seats || 'G4, G5' }}</p>
                    </div>
                    <div class="text-right">
                         <p class="text-xs text-gray-500 uppercase">Total</p>
                         <p class="font-bold text-xl">{{ (bookingData?.price | currency) || '$ 24.00' }}</p>
                    </div>
                </div>

                <!-- Cutout circles -->
                 <div class="absolute -left-3 bottom-[-12px] w-6 h-6 bg-[#141414] rounded-full"></div>
                 <div class="absolute -right-3 bottom-[-12px] w-6 h-6 bg-[#141414] rounded-full"></div>
            </div>

            <!-- QR Code -->
            <div class="p-8 flex flex-col items-center justify-center bg-white">
                <img [src]="'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' + (bookingData?.bookingId || 'MOCK-12345')" alt="Ticket QR" class="w-40 h-40 mix-blend-multiply">
                <p class="text-gray-500 text-xs mt-4 tracking-widest uppercase">Scan at entry</p>
                <p class="text-black font-mono font-bold mt-1 text-lg">{{ bookingData?.bookingId || 'TIK-88593' }}</p>
            </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-col gap-4">
             <button class="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Ticket
             </button>
             <a routerLink="/" class="w-full border border-gray-700 hover:border-cinema-red text-gray-400 hover:text-white py-3 rounded-xl font-medium transition text-center">
                Back to Home
             </a>
        </div>

      </div>
    </div>
  `,
    styles: [`
    .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp {
        from { transform: translateY(40px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class BookingConfirmationComponent implements OnInit {
    bookingData: any;

    constructor(private router: Router) {
        const nav = this.router.getCurrentNavigation();
        if (nav?.extras?.state) {
            this.bookingData = nav.extras.state['booking'];
        }
    }

    ngOnInit() {
        // Fallback or dev mock could be handled here if accessed directly
    }
}
