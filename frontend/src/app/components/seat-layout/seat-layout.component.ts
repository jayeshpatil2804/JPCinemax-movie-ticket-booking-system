import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Seat {
    id: string;
    row: string;
    number: number;
    type: 'PLATINUM' | 'GOLD' | 'EXECUTIVE' | 'SPECIAL';
    price: number;
    status: 'AVAILABLE' | 'BOOKED' | 'SELECTED' | 'DISABLED';
}

export interface SeatSection {
    name: string;
    price: number;
    rows: Seat[][];
}

@Component({
    selector: 'app-seat-layout',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="w-full max-w-4xl mx-auto p-4 bg-[#121212] rounded-xl shadow-2xl border border-white/5 text-white select-none">
      
      <!-- Screen -->
      <div class="mb-10 relative group">
        <div class="w-2/3 mx-auto h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent shadow-[0_10px_30px_rgba(6,182,212,0.5)] rounded-[50%] opacity-80 group-hover:opacity-100 transition-opacity"></div>
        <p class="text-center text-xs text-cyan-400 mt-4 tracking-[0.3em] font-light uppercase opacity-70">Screen This Way</p>
        
        <!-- Screen Glow Effect -->
        <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/10 blur-[50px] rounded-[100%] pointer-events-none"></div>
      </div>

      <!-- Legend -->
      <div class="flex flex-wrap justify-center gap-4 mb-8 text-xs text-gray-400 border-b border-white/5 pb-6">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded border border-white/20 hover:scale-110 transition-transform"></div>
          <span>Available</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded bg-cinema-red shadow-[0_0_10px_rgba(220,10,10,0.6)] border border-red-500 animate-pulse-slow"></div>
          <span>Selected</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded bg-gray-700/50 cursor-not-allowed text-gray-500 flex items-center justify-center">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </div>
          <span>Booked</span>
        </div>
      </div>

      <!-- Seats Container -->
      <div class="flex flex-col gap-8 overflow-x-auto pb-4 custom-scrollbar">
        
        <div *ngFor="let section of sections" class="relative">
          <!-- Section Header -->
          <div class="text-xs uppercase font-bold text-gray-500 mb-2 pl-2 border-l-2 border-cinema-red/50 flex justify-between items-center">
             <span>{{section.name}}</span>
             <span class="text-white">₹{{section.price}}</span>
          </div>

          <div class="flex flex-col gap-3 items-center">
            <div *ngFor="let row of section.rows" class="flex items-center gap-6 sm:gap-14">
              <!-- Row Label Left -->
              <span class="w-6 text-center text-xs font-mono text-gray-600 font-bold bg-[#1a1a1a] rounded p-1">{{row[0].row}}</span>
              
              <div class="flex gap-2 sm:gap-3">
                <ng-container *ngFor="let seat of row; let i = index">
                   
                   <!-- Aisle Gap -->
                   <div *ngIf="i === row.length / 2" class="w-4 sm:w-8"></div>

                   <!-- Seat -->
                   <button 
                     (click)="toggleSeat(seat)"
                     [disabled]="seat.status === 'BOOKED' || seat.status === 'DISABLED'"
                     [class]="getSeatClasses(seat)"
                     class="group relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg rounded-b-md text-[10px] font-medium transition-all duration-300 transform active:scale-95 flex items-center justify-center border"
                   >
                      <span class="group-hover:opacity-100 opacity-60 z-10">{{seat.number}}</span>
                      
                      <!-- Seat Glow on Hover -->
                      <div class="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 bg-white/10 blur-[2px] transition-opacity pointer-events-none"></div>
                   </button>
                </ng-container>
              </div>

               <!-- Row Label Right -->
               <span class="w-6 text-center text-xs font-mono text-gray-600 font-bold bg-[#1a1a1a] rounded p-1">{{row[0].row}}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- Sticky Booking Summary -->
      <div class="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#121212]/90 backdrop-blur sticky bottom-0 z-50 p-4 rounded-xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
         <div class="flex flex-col gap-1 items-center sm:items-start text-center sm:text-left">
           <span class="text-gray-400 text-xs uppercase">Selected Seats ({{selectedSeats.length}}/{{maxSeats}})</span>
           <div class="text-white font-mono text-sm font-bold min-h-[20px] max-w-[250px] truncate leading-tight">
             {{ getSelectedSeatLabels() || 'No seats selected' }}
           </div>
         </div>

         <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="flex flex-col items-end">
               <span class="text-gray-400 text-xs uppercase">Total Price</span>
               <span class="text-2xl font-bold text-cinema-red drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">₹{{totalPrice}}</span>
            </div>
            
            <button 
              [disabled]="selectedSeats.length === 0"
              (click)="confirmBooking()"
              class="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-cinema-red to-red-700 text-white font-bold rounded-lg shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all uppercase tracking-wide text-sm"
            >
              Confirm
            </button>
         </div>
      </div>

    </div>
  `,
    styles: [`
    .animate-pulse-slow {
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: .7; transform: scale(1.05); }
    }
    .custom-scrollbar::-webkit-scrollbar {
        height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #1a1a1a;
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 4px;
    }
  `]
})
export class SeatLayoutComponent implements OnInit {
    @Input() movieTitle: string = 'Movie Name';
    @Input() maxSeats: number = 6;
    @Input() sections: SeatSection[] = [];
    @Output() onBookingConfirm = new EventEmitter<{ seats: Seat[], total: number }>();

    selectedSeats: Seat[] = [];
    totalPrice: number = 0;

    ngOnInit() {
        if (this.sections.length === 0) {
            this.initSections();
        }
    }

    initSections() {
        // Generate mock Seat Layout resembling Miraj Cinemas
        this.sections = [
            {
                name: 'PLATINUM',
                price: 350,
                rows: this.generateRows('A', 'D', 14, 350, 'PLATINUM')
            },
            {
                name: 'GOLD',
                price: 250,
                rows: this.generateRows('E', 'H', 16, 250, 'GOLD')
            },
            {
                name: 'EXECUTIVE',
                price: 200,
                rows: this.generateRows('I', 'K', 18, 200, 'EXECUTIVE')
            },
            {
                name: 'SPECIAL',
                price: 150,
                rows: this.generateRows('L', 'M', 20, 150, 'SPECIAL')
            }
        ];
    }

    generateRows(startRow: string, endRow: string, seatsPerRow: number, price: number, type: any): Seat[][] {
        const rows: Seat[][] = [];
        const startCharCode = startRow.charCodeAt(0);
        const endCharCode = endRow.charCodeAt(0);

        for (let i = startCharCode; i <= endCharCode; i++) {
            const rowLabel = String.fromCharCode(i);
            const rowSeats: Seat[] = [];
            for (let j = 1; j <= seatsPerRow; j++) {
                // Randomly book some seats for demo
                const isBooked = Math.random() < 0.15;
                rowSeats.push({
                    id: `${rowLabel}${j}`,
                    row: rowLabel,
                    number: j,
                    type: type,
                    price: price,
                    status: isBooked ? 'BOOKED' : 'AVAILABLE'
                });
            }
            rows.push(rowSeats);
        }
        return rows;
    }

    toggleSeat(seat: Seat) {
        if (seat.status === 'BOOKED' || seat.status === 'DISABLED') return;

        if (seat.status === 'SELECTED') {
            seat.status = 'AVAILABLE';
            this.selectedSeats = this.selectedSeats.filter(s => s.id !== seat.id);
        } else {
            if (this.selectedSeats.length >= this.maxSeats) {
                alert(`You can only select up to ${this.maxSeats} seats.`);
                return;
            }
            seat.status = 'SELECTED';
            this.selectedSeats.push(seat);
        }
        this.calculateTotal();
    }

    calculateTotal() {
        this.totalPrice = this.selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
    }

    getSeatClasses(seat: Seat): string {
        const baseClasses = "border-opacity-50";

        switch (seat.status) {
            case 'AVAILABLE':
                // Different colors for categories
                if (seat.type === 'PLATINUM') return `${baseClasses} bg-purple-900/20 border-purple-500 hover:bg-purple-800 text-purple-200`;
                if (seat.type === 'GOLD') return `${baseClasses} bg-yellow-900/20 border-yellow-500 hover:bg-yellow-800 text-yellow-200`;
                if (seat.type === 'EXECUTIVE') return `${baseClasses} bg-blue-900/20 border-blue-500 hover:bg-blue-800 text-blue-200`;
                return `${baseClasses} bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-300`;

            case 'SELECTED':
                return `bg-cinema-red text-white border-red-400 shadow-[0_0_15px_rgba(220,10,10,0.5)] transform scale-110 z-10`;

            case 'BOOKED':
                return `bg-gray-800/50 text-transparent border-transparent cursor-not-allowed opacity-40`;

            case 'DISABLED':
                return `invisible`;

            default:
                return `bg-gray-800`;
        }
    }

    getSelectedSeatLabels(): string {
        return this.selectedSeats.map(s => `${s.row}${s.number}`).join(', ');
    }

    confirmBooking() {
        this.onBookingConfirm.emit({
            seats: this.selectedSeats,
            total: this.totalPrice
        });
    }
}
