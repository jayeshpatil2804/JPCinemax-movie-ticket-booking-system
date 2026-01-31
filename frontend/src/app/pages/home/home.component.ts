import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroSliderComponent } from '../../components/home/hero-slider/hero-slider.component';
import { NowShowingComponent } from '../../components/home/now-showing/now-showing.component';
import { UpcomingComponent } from '../../components/home/upcoming/upcoming.component';
import { MovieService } from '../../services/movie.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, HeroSliderComponent, NowShowingComponent, UpcomingComponent],
    template: `
    <div class="bg-black min-h-screen">
       <app-hero-slider [movies]="nowShowingMovies"></app-hero-slider>
       
       <app-now-showing [movies]="nowShowingMovies"></app-now-showing>
       
       <app-upcoming [movies]="upcomingMovies"></app-upcoming>

       <!-- Newsletter / Footer teaser could go here -->
    </div>
  `
})
export class HomeComponent implements OnInit {
    nowShowingMovies: any[] = [];
    upcomingMovies: any[] = [];

    constructor(private movieService: MovieService) { }

    ngOnInit() {
        this.movieService.getNowShowing().subscribe({
            next: (data) => this.nowShowingMovies = data,
            error: (err) => console.error('Error fetching now showing:', err)
        });

        this.movieService.getComingSoon().subscribe({
            next: (data) => this.upcomingMovies = data,
            error: (err) => console.error('Error fetching upcoming:', err)
        });
    }
}
