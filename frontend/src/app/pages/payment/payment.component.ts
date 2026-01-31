import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-payment',
   standalone: true,
   imports: [CommonModule, CurrencyPipe, FormsModule],
   template: `
    <div class="min-h-screen bg-[#141414] text-white flex items-center justify-center p-4">
      <div class="w-full max-w-lg bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden relative">
        
        <!-- Header -->
        <div class="bg-gray-900/50 p-6 border-b border-gray-800 flex items-center justify-between">
           <h1 class="text-xl font-bold flex items-center gap-2">
             <span class="w-1 h-6 bg-cinema-red rounded-full"></span>
             Complete Payment
           </h1>
           <button (click)="goBack()" class="text-gray-500 hover:text-white transition">Cancel</button>
        </div>

        <div class="p-6">
           <!-- Order Summary -->
           <div class="bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
              <h2 class="text-sm font-bold text-gray-400 uppercase mb-3">Order Summary</h2>
              <div class="flex justify-between text-gray-300 mb-1">
                 <span>Movie</span>
                 <span class="font-medium text-white">{{paymentData?.show?.movie?.title}}</span>
              </div>
              <div class="flex justify-between text-gray-300 mb-1">
                 <span>Cinema</span>
                 <span class="font-medium text-white">{{paymentData?.show?.cinema?.name}}</span>
              </div>
              <div class="flex justify-between text-gray-300 mb-1">
                 <span>Seats ({{paymentData?.selectedSeats?.length}})</span>
                 <span class="font-medium text-white">
                    {{getSeatLabels()}}
                 </span>
              </div>
              
              <div class="border-t border-gray-700 my-3"></div>
              
              <div class="flex justify-between text-gray-400 text-sm mb-1">
                 <span>Ticket Price</span>
                 <span>{{paymentData?.totalPrice | currency:'INR'}}</span>
              </div>
              <div class="flex justify-between text-gray-400 text-sm mb-1">
                 <span>Convenience Fee</span>
                 <span>{{30 | currency:'INR'}}</span>
              </div>
              
              <div class="border-t border-gray-700 my-3"></div>
              
              <div class="flex justify-between text-xl font-bold text-white">
                 <span>Total Payable</span>
                 <span class="text-cinema-red">{{(paymentData?.totalPrice + 30) | currency:'INR'}}</span>
              </div>
           </div>

           <!-- Payment Methods -->
           <h3 class="text-sm font-bold text-gray-400 uppercase mb-3">Select Payment Method</h3>
           <div class="space-y-3 mb-8">
              <label class="flex items-center p-4 rounded-xl border border-gray-700 cursor-pointer hover:border-cinema-red bg-gray-800/30 transition group relative overflow-hidden"
                     [class.border-cinema-red]="selectedMethod === 'card'"
                     [class.bg-gray-800]="selectedMethod === 'card'">
                 <input type="radio" name="payment" value="card" [(ngModel)]="selectedMethod" class="hidden">
                 <div class="w-5 h-5 rounded-full border border-gray-500 mr-4 flex items-center justify-center group-hover:border-cinema-red"
                      [class.border-cinema-red]="selectedMethod === 'card'">
                    <div class="w-3 h-3 rounded-full bg-cinema-red transform scale-0 transition-transform duration-200"
                         [class.scale-100]="selectedMethod === 'card'"></div>
                 </div>
                 <div class="flex-1">
                    <span class="text-white font-medium block">Credit / Debit Card</span>
                    <span class="text-xs text-gray-500">Visa, Mastercard, Rupay</span>
                 </div>
                 <div class="flex gap-2 opacity-50">
                    <div class="w-8 h-5 bg-white rounded"></div>
                    <div class="w-8 h-5 bg-white rounded"></div>
                 </div>
              </label>

              <label class="flex items-center p-4 rounded-xl border border-gray-700 cursor-pointer hover:border-cinema-red bg-gray-800/30 transition group"
                     [class.border-cinema-red]="selectedMethod === 'upi'"
                     [class.bg-gray-800]="selectedMethod === 'upi'">
                 <input type="radio" name="payment" value="upi" [(ngModel)]="selectedMethod" class="hidden">
                 <div class="w-5 h-5 rounded-full border border-gray-500 mr-4 flex items-center justify-center group-hover:border-cinema-red"
                      [class.border-cinema-red]="selectedMethod === 'upi'">
                    <div class="w-3 h-3 rounded-full bg-cinema-red transform scale-0 transition-transform duration-200"
                         [class.scale-100]="selectedMethod === 'upi'"></div>
                 </div>
                 <div class="flex-1">
                    <span class="text-white font-medium block">UPI</span>
                    <span class="text-xs text-gray-500">Google Pay, PhonePe, Paytm</span>
                 </div>
              </label>
           </div>

           <!-- Pay Button -->
           <button (click)="processPayment()" 
                   [disabled]="loading || !selectedMethod"
                   class="w-full bg-gradient-to-r from-cinema-red to-red-700 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-red-900/50 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center relative overflow-hidden">
                
                <div *ngIf="loading" class="absolute inset-0 bg-black/20 flex items-center justify-center">
                   <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span [class.opacity-0]="loading">
                   Pay {{(paymentData?.totalPrice + 30) | currency:'INR'}}
                </span>
           </button>
           
           <p class="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                Secure Payment by MockPay
           </p>
        </div>
        
        <!-- Success Overlay -->
        <div *ngIf="paymentSuccess" class="absolute inset-0 bg-[#141414] z-50 flex flex-col items-center justify-center animate-fade-in">
           <div class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
           </div>
           <h2 class="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
           <p class="text-gray-400">Redirecting to confirmation...</p>
        </div>
      </div>
    </div>
  `
})
export class PaymentComponent implements OnInit {
   paymentData: any;
   selectedMethod = 'card';
   loading = false;
   paymentSuccess = false;

   constructor(
      private router: Router,
      private location: Location,
      private bookingService: BookingService
   ) {
      const nav = this.router.getCurrentNavigation();
      if (nav?.extras.state) {
         this.paymentData = nav.extras.state;
      } else {
         // Fallback or redirect if no state (e.g. direct access)
         // Check history state just in case
         this.paymentData = history.state;
         if (!this.paymentData || !this.paymentData.selectedSeats) {
            this.router.navigate(['/']);
         }
      }
   }

   ngOnInit() { }

   getSeatLabels(): string {
      return this.paymentData?.selectedSeats?.map((s: any) => `${s.row}${s.number}`).join(', ') || '';
   }

   goBack() {
      this.location.back();
   }

   processPayment() {
      this.loading = true;

      // 1. Simulate Payment Delay (2-3 seconds)
      setTimeout(() => {
         this.paymentSuccess = true;

         // 2. Call API to Create Booking
         const bookingPayload = {
            showId: this.paymentData.show._id,
            seats: this.paymentData.selectedSeats.map((s: any) => ({
               row: s.row,
               number: s.number,
               price: s.price,
               type: s.type
            })),
            totalPrice: this.paymentData.totalPrice + 30 // Include fee
         };

         this.bookingService.createBooking(bookingPayload).subscribe({
            next: (response) => {
               // 3. Redirect to Booking Success with response data
               setTimeout(() => {
                  this.router.navigate(['/booking-success'], { state: { booking: response } });
               }, 1500);
            },
            error: (err) => {
               console.error('Booking API failed, using fallback:', err);
               // FALLBACK: User paid, so show the ticket even if DB save failed (per requirements)
               const fallbackBooking = {
                  ...bookingPayload,
                  user: 'CURRENT_USER', // valid ID not critical for display
                  bookingId: 'OFF-' + Math.floor(Math.random() * 100000),
                  paymentStatus: 'SUCCESS',
                  qrCode: 'OFFLINE_TICKET',
                  show: this.paymentData.show // Pass full show object for display
               };

               // Force success simulation
               this.router.navigate(['/booking-success'], { state: { booking: fallbackBooking } });
               this.loading = false;
            }
         });

      }, 2500);
   }
}
