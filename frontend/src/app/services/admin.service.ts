import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:5000/api';

    constructor(private http: HttpClient, private authService: AuthService) { }

    getHeaders() {
        return { headers: { 'x-auth-token': this.authService.getToken() || '' } };
    }

    getStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/admin/stats`, this.getHeaders());
    }

    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`, this.getHeaders());
    }

    toggleBlockUser(userId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/users/${userId}/block`, {}, this.getHeaders());
    }

    updateUserRole(userId: string, role: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/users/${userId}`, { role }, this.getHeaders());
    }

    getAllBookings(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/bookings`, this.getHeaders()); // uses admin route in bookingRoutes
    }
}
