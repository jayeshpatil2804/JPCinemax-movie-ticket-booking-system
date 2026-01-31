import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShowService } from '../../services/show.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { SeatLayoutComponent, Seat, SeatSection } from '../../components/seat-layout/seat-layout.component';

@Component({
    selector: 'app-seat-selection',
    standalone: true,
    imports: [CommonModule, SeatLayoutComponent],
    template: `
    <div *ngIf="show" class="min-h-screen bg-[#141414] text-white flex flex-col items-center py-8 px-4">
       <!-- Header -->
       <div class="text-center mb-10">
          <h1 class="text-3xl font-bold mb-2">{{show.movie.title}}</h1>
          <p class="text-gray-400">{{show.cinema.name}} • {{show.startTime | date:'shortTime'}} • {{show.startTime | date:'mediumDate'}}</p>
       </div>

       <!-- Seat Layout Component -->
       <app-seat-layout 
          [movieTitle]="show.movie.title"
          [sections]="sections"
          [maxSeats]="8"
          (onBookingConfirm)="onSeatConfirm($event)">
       </app-seat-layout>



    </div>
  `,
    styles: [`
    .shadow-red-glow { box-shadow: 0 0 15px rgba(229, 9, 20, 0.6); }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SeatSelectionComponent implements OnInit {
    show: any;
    sections: SeatSection[] = [];
    selectedSeats: Seat[] = [];
    totalPrice: number = 0;
    bookingLoading = false;
    showPaymentModal = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private showService: ShowService,
        private bookingService: BookingService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return;
        }

        const showId = this.route.snapshot.paramMap.get('id');
        if (showId) {
            this.showService.getShowById(showId).subscribe({
                next: (data) => {
                    this.show = data;

                    // 1. Generate the Base Layout (Full Hall)
                    const fullLayout = this.generateMockSeats();

                    // 2. Mark seats as BOOKED from Backend Data
                    if (data.seats && data.seats.length > 0) {
                        this.mergeBookedSeats(fullLayout, data.seats);
                    }

                    // 3. Convert to Sections for Rendering
                    this.sections = this.convertToSections(fullLayout);
                },
                error: (err) => alert('Error loading show details')
            });
        }
    }

    mergeBookedSeats(layoutSeats: any[], bookedSeats: any[]) {
        // Create a lookup map for faster access
        const bookedMap = new Set(bookedSeats.map(s => `${s.row}-${s.number}`));

        layoutSeats.forEach(seat => {
            const key = `${seat.row}-${seat.number}`;
            if (bookedMap.has(key)) {
                seat.status = 'BOOKED';
            }
        });
    }

    generateMockSeats(): any[] {
        const seats = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        for (const row of rows) {
            const isPremium = row === 'G' || row === 'H';
            const price = isPremium ? 450 : 250;
            const type = isPremium ? 'GOLD' : 'EXECUTIVE';

            for (let i = 1; i <= 10; i++) {
                const isBooked = Math.random() < 0.2;
                seats.push({
                    id: `${row}${i}`,
                    row: row,
                    number: i,
                    price: price,
                    type: type,
                    status: isBooked ? 'BOOKED' : 'AVAILABLE'
                });
            }
        }
        return seats;
    }

    convertToSections(flatSeats: any[]): SeatSection[] {
        // Group by Type to create sections
        const groupedByType = flatSeats.reduce((acc, seat) => {
            const type = seat.type || 'STANDARD';
            if (!acc[type]) acc[type] = [];
            acc[type].push(seat);
            return acc;
        }, {});

        const sections: SeatSection[] = [];

        for (const type of Object.keys(groupedByType)) {
            const seatsOfType = groupedByType[type];
            // Group seats of this type by row
            const rows: any = {};
            seatsOfType.forEach((seat: any) => {
                if (!rows[seat.row]) rows[seat.row] = [];
                rows[seat.row].push({
                    ...seat,
                    // Ensure status is valid
                    status: seat.isBooked ? 'BOOKED' : seat.status || 'AVAILABLE'
                });
            });

            const rowsArray = Object.keys(rows).sort().map(r => rows[r].sort((a: any, b: any) => a.number - b.number));

            sections.push({
                name: type,
                price: seatsOfType[0].price || 0,
                rows: rowsArray
            });
        }
        return sections;
    }

    onSeatConfirm(event: { seats: Seat[], total: number }) {
        this.selectedSeats = event.seats;
        this.totalPrice = event.total;
        this.proceedToPayment();
    }

    proceedToPayment() {
        if (this.selectedSeats.length === 0) return;

        const paymentState = {
            show: this.show,
            selectedSeats: this.selectedSeats,
            totalPrice: this.totalPrice
        };

        this.router.navigate(['/payment'], { state: paymentState });
    }
}
