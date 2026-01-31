import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ShowService {
    private apiUrl = 'http://localhost:5000/api/shows';

    constructor(private http: HttpClient) { }

    getShows(filters?: any): Observable<any[]> {
        let params = new HttpParams();
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key]) params = params.append(key, filters[key]);
            });
        }
        return this.http.get<any[]>(this.apiUrl, { params });
    }

    getShowById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createShow(show: any): Observable<any> {
        return this.http.post(this.apiUrl, show);
    }

    deleteShow(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
