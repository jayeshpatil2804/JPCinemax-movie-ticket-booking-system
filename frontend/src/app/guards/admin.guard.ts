import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (authService.isAuthenticated() && authService.isAdmin()) {
        return true;
    }

    router.navigate(['/']); // Redirect to home if not admin
    return false;
};
