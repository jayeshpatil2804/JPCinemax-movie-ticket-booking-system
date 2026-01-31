import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BookingService } from '../../../../services/booking.service';
import { AdminService } from '../../../../services/admin.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6 animate-fade-in">
        <h2 class="text-2xl font-bold text-white">Booking Management</h2>

        <div class="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table class="w-full text-left">
            <thead class="bg-black/40 text-gray-400 uppercase text-xs font-semibold tracking-wider">
                <tr>
                    <th class="px-6 py-4">Booking ID</th>
                    <th class="px-6 py-4">User</th>
                    <th class="px-6 py-4">Movie</th>
                    <th class="px-6 py-4">Seats</th>
                    <th class="px-6 py-4">Amount</th>
                    <th class="px-6 py-4">Status</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
                 <tr *ngIf="bookings.length === 0">
                     <td colspan="6" class="px-6 py-8 text-center text-gray-500">No bookings found.</td>
                 </tr>
                <tr *ngFor="let booking of bookings" class="hover:bg-gray-800/50 transition">
                    <td class="px-6 py-4 font-mono text-xs text-gray-500">{{booking.bookingId || booking._id | slice:0:8}}</td>
                    <td class="px-6 py-4 font-medium text-white">{{booking.user?.name || 'Guest'}}</td>
                    <td class="px-6 py-4 text-gray-400">
                        {{booking.show?.movie?.title}}<br>
                        <span class="text-xs text-gray-600">{{booking.show?.startTime | date:'short'}}</span>
                    </td>
                    <td class="px-6 py-4 text-gray-400">
                        <span *ngFor="let seat of booking.seats" class="inline-block bg-gray-800 px-1.5 rounded text-xs mr-1">{{seat.row}}{{seat.number}}</span>
                    </td>
                    <td class="px-6 py-4 text-cinema-red font-bold">{{booking.totalPrice | currency:'INR'}}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded text-xs font-bold"
                            [class.bg-green-500_10]="booking.paymentStatus === 'SUCCESS'"
                            [class.text-green-500]="booking.paymentStatus === 'SUCCESS'"
                            [class.bg-yellow-500_10]="booking.paymentStatus === 'PENDING'"
                            [class.text-yellow-500]="booking.paymentStatus === 'PENDING'">
                            {{booking.paymentStatus}}
                        </span>
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
    .bg-green-500\\/10 { background-color: rgba(34, 197, 94, 0.1); }
    .bg-yellow-500\\/10 { background-color: rgba(234, 179, 8, 0.1); }
  `]
})
export class AdminBookingsComponent implements OnInit {
  bookings: any[] = [];

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    // Use AdminService to get all bookings (admin view)
    this.adminService.getAllBookings().subscribe((data) => this.bookings = data);
  }
}
