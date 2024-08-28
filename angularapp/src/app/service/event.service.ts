import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../model/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'https://8080-dbbfffafefccdac315598698bcaabaffaeeedone.premiumproject.examly.io';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/api/events`);
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/api/events/${id}`);
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/api/events`, event);
  }

  updateEvent(id: number, event: Event): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/api/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/events/${id}`);
  }
}