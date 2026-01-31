import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
   selector: 'app-admin-dashboard',
   standalone: true,
   imports: [CommonModule, CurrencyPipe],
   template: `
    <div class="space-y-6 animate-fade-in">
       <!-- Header -->
       <div class="flex justify-between items-end">
          <div>
            <h1 class="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p class="text-gray-400 mt-1">Welcome back, Admin</p>
          </div>
          <button (click)="loadStats()" class="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition">
             Refresh Data
          </button>
       </div>

       <!-- Stats Grid -->
       <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Total Revenue -->
          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
             <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p class="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Total Revenue</p>
             <h3 class="text-3xl font-bold text-white">{{stats?.totalRevenue | currency:'INR'}}</h3>
             <p class="text-green-500 text-sm mt-2 flex items-center gap-1">
                <span class="bg-green-500/10 px-1 rounded">+12%</span> from last month
             </p>
          </div>

          <!-- Total Bookings -->
          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
             <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
             </div>
             <p class="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Bookings</p>
             <h3 class="text-3xl font-bold text-white">{{stats?.totalBookings}}</h3>
          </div>

          <!-- Movies Active -->
          <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
             <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
             </div>
             <p class="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Total Movies</p>
             <h3 class="text-3xl font-bold text-white">{{stats?.totalMovies}}</h3>
          </div>

          <!-- Users -->
           <div class="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
             <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
             </div>
             <p class="text-gray-400 text-sm uppercase font-bold tracking-wider mb-2">Registered Users</p>
             <h3 class="text-3xl font-bold text-white">{{stats?.totalUsers}}</h3>
          </div>

       </div>

       <!-- Recent Activity -->
       <div class="bg-[#1a1a1a] rounded-2xl border border-white/5 p-6 mt-6">
          <h2 class="text-xl font-bold text-white mb-6">Recent Bookings</h2>
          
          <div class="overflow-x-auto">
             <table class="w-full text-left text-gray-400">
                <thead class="text-xs uppercase bg-[#111] text-gray-500">
                   <tr>
                      <th class="px-4 py-3 rounded-l-lg">User</th>
                      <th class="px-4 py-3">Movie</th>
                      <th class="px-4 py-3">Cinema</th>
                      <th class="px-4 py-3">Amount</th>
                      <th class="px-4 py-3">Status</th>
                      <th class="px-4 py-3 rounded-r-lg">Date</th>
                   </tr>
                </thead>
                <tbody class="text-sm">
                   <tr *ngFor="let booking of recentBookings" class="border-b border-gray-800 hover:bg-white/5 transition">
                      <td class="px-4 py-4 font-medium text-white">{{booking.user?.name || 'Guest'}}</td>
                      <td class="px-4 py-4">{{booking.show?.movie?.title}}</td>
                      <td class="px-4 py-4">{{booking.show?.cinema?.name}}</td>
                      <td class="px-4 py-4 font-mono text-white">{{booking.totalPrice | currency:'INR'}}</td>
                      <td class="px-4 py-4">
                         <span class="px-2 py-1 rounded text-xs font-bold"
                             [class.bg-green-500_10]="booking.paymentStatus === 'SUCCESS'"
                             [class.text-green-500]="booking.paymentStatus === 'SUCCESS'"
                             [class.bg-yellow-500_10]="booking.paymentStatus === 'PENDING'"
                             [class.text-yellow-500]="booking.paymentStatus === 'PENDING'">
                             {{booking.paymentStatus}}
                         </span>
                      </td>
                      <td class="px-4 py-4">{{booking.bookingDate | date:'mediumDate'}}</td>
                   </tr>
                </tbody>
             </table>
             <div *ngIf="recentBookings.length === 0" class="text-center py-8">
                No recent bookings found.
             </div>
          </div>
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
export class AdminDashboardComponent implements OnInit {
   stats: any;
   recentBookings: any[] = [];

   constructor(private adminService: AdminService) { }

   ngOnInit() {
      this.loadStats();
   }

   loadStats() {
      this.adminService.getStats().subscribe({
         next: (data) => {
            this.stats = data.stats;
            this.recentBookings = data.recentBookings;
         },
         error: (err) => console.error('Failed to load stats', err)
      });
   }
}
