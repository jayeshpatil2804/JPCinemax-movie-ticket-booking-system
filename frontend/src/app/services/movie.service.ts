import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  bannerUrl?: string; // For Hero section
  language: string;
  genre: string[];
  duration: string; // e.g., "2h 15m"
  releaseDate?: string;
  rating?: string; // e.g., "UA", "A"
  type: 'NOW_SHOWING' | 'COMING_SOON';
  description?: string;
  cast?: string[][]; // Array of [initials, name] or just name strings if simplified
  crew?: string[];
}

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:5000/api/movies';

  constructor(private http: HttpClient) { }

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getNowShowing(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(movies => movies.filter(m => m.status === 'NOW_SHOWING'))
    );
  }

  getComingSoon(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(movies => movies.filter(m => m.status === 'COMING_SOON'))
    );
  }

  getMovieById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Admin / CRUD methods
  createMovie(movie: any): Observable<any> {
    return this.http.post(this.apiUrl, movie);
  }

  updateMovie(id: string, movie: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, movie);
  }

  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
