import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private apiUrl = 'http://localhost:5000/api/bookings';

    constructor(private http: HttpClient) { }

    createBooking(booking: any): Observable<any> {
        return this.http.post(this.apiUrl, booking);
    }

    getMyBookings(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/my-bookings`);
    }

    getAllBookings(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}
