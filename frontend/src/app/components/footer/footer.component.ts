import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-black text-gray-400 py-12 border-t border-gray-800">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div>
            <a routerLink="/" class="text-2xl font-black tracking-tighter text-white block">
              <span class="text-cinema-red">M</span>IRAJ <span class="text-base font-normal tracking-widest text-gray-500 border-l border-gray-700 pl-2 ml-1">CINEMAS</span>
            </a>
            <p class="text-sm">
              Experience the magic of cinema with state-of-the-art screens, immersive sound, and premium comfort.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Quick Links</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="hover:text-cinema-red transition">Home</a></li>
              <li><a routerLink="/movies" class="hover:text-cinema-red transition">Now Showing</a></li>
              <li><a routerLink="/cinemas" class="hover:text-cinema-red transition">Cinemas</a></li>
              <li><a routerLink="/about" class="hover:text-cinema-red transition">About Us</a></li>
            </ul>
          </div>

          <!-- Helper Links -->
          <div>
            <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Support</h3>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-cinema-red transition">FAQ</a></li>
              <li><a href="#" class="hover:text-cinema-red transition">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-cinema-red transition">Terms of Service</a></li>
              <li><a href="#" class="hover:text-cinema-red transition">Contact Support</a></li>
            </ul>
          </div>

          <!-- Social / Newsletter -->
          <div>
             <h3 class="text-white font-bold mb-4 uppercase text-sm tracking-wider">Connect With Us</h3>
             <div class="flex space-x-4 mb-6">
               <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cinema-red hover:text-white transition">
                 <span class="font-bold">fb</span>
               </a>
               <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cinema-red hover:text-white transition">
                 <span class="font-bold">tw</span>
               </a>
               <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cinema-red hover:text-white transition">
                 <span class="font-bold">ig</span>
               </a>
             </div>
             <p class="text-xs text-gray-500">Subscribe for updates & offers (Dummy)</p>
          </div>
        </div>

        <div class="border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
          &copy; {{ currentYear }} <strong>CINEMATIK</strong>. All Rights Reserved. Designed for User Experience.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
