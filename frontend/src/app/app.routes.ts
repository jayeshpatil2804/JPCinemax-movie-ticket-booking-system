import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { SeatSelectionComponent } from './pages/seat-selection/seat-selection.component';
import { MoviesComponent } from './pages/movies/movies.component';

import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminMoviesComponent } from './pages/admin/movies/admin-movies/admin-movies';
import { AdminCinemasComponent } from './pages/admin/cinemas/admin-cinemas/admin-cinemas';
import { AdminShowsComponent } from './pages/admin/shows/admin-shows/admin-shows';
import { AdminBookingsComponent } from './pages/admin/bookings/admin-bookings/admin-bookings';
import { AdminUsersComponent } from './pages/admin/users/admin-users/admin-users';
import { adminGuard } from './guards/admin.guard';
import { PaymentComponent } from './pages/payment/payment.component';
import { BookingSuccessComponent } from './pages/booking-success/booking-success.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'movies', component: MoviesComponent },
    { path: 'login', component: LoginComponent },

    { path: 'register', component: RegisterComponent },
    { path: 'movie/:id', component: MovieDetailsComponent },
    { path: 'movie/:id/book', component: MovieDetailsComponent }, // Alias for booking flow
    { path: 'select-seats/:id', component: SeatSelectionComponent, canActivate: [authGuard] },

    // Booking Flow
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
    { path: 'booking-success', component: BookingSuccessComponent, canActivate: [authGuard] },
    { path: 'booking-confirmation', redirectTo: 'booking-success' }, // Redirect old route

    { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] },

    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: AdminDashboardComponent },
            // Add placeholders for other modules if they reuse the dashboard or separate components
            { path: 'movies', component: AdminMoviesComponent }, // Reuse for now or create specific
            { path: 'cinemas', component: AdminCinemasComponent },
            { path: 'shows', component: AdminShowsComponent },
            { path: 'bookings', component: AdminBookingsComponent },
            { path: 'users', component: AdminUsersComponent }
        ]
    },

    // Booking Flow (User)
    { path: 'payment', component: PaymentComponent, canActivate: [authGuard] },
    { path: 'booking-success', component: BookingSuccessComponent, canActivate: [authGuard] },
    { path: 'booking-confirmation', redirectTo: 'booking-success' },
    { path: 'my-bookings', component: MyBookingsComponent, canActivate: [authGuard] },

    { path: '**', redirectTo: '' }
];
