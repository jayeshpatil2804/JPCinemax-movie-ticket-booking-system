import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CinemaService {
    private apiUrl = 'http://localhost:5000/api/cinemas';

    constructor(private http: HttpClient) { }

    getCinemas(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getCinemaById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createCinema(cinema: any): Observable<any> {
        return this.http.post(this.apiUrl, cinema);
    }

    updateCinema(id: string, cinema: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, cinema);
    }

    deleteCinema(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
