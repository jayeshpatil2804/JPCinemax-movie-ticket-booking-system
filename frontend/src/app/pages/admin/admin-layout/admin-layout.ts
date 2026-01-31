import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-[#111]">
      <!-- Sidebar -->
      <aside class="w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col fixed h-full z-50">
        <div class="p-6 border-b border-white/5 flex items-center gap-3">
          <div class="w-8 h-8 bg-cinema-red rounded flex items-center justify-center font-bold text-white">A</div>
          <span class="text-xl font-bold text-white tracking-wide">Admin Panel</span>
        </div>

        <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
          <a routerLink="/admin/dashboard" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
             <span>📊</span> Dashboard
          </a>
          <a routerLink="/admin/movies" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
             <span>🎬</span> Movies
          </a>
          <a routerLink="/admin/cinemas" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
             <span>🏢</span> Cinemas
          </a>
          <a routerLink="/admin/shows" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
             <span>🎞️</span> Shows
          </a>
          <a routerLink="/admin/bookings" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
             <span>🎟️</span> Bookings
          </a>
          <a routerLink="/admin/users" routerLinkActive="bg-white/10 text-white" class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition">
             <span>👥</span> Users
          </a>
        </nav>
        
        <div class="p-4 border-t border-white/5">
           <a routerLink="/" class="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition">
             <span>⬅️</span> Back to Site
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 overflow-y-auto bg-[#141414] p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminLayout { }
