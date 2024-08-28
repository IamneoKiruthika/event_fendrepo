import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../service/event.service';
import { Event } from '../model/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: Event[] = [];
  successMessage: string;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(data => {
      this.events = data;
    });
  }

  deleteEvent(id: number): void {
    this.eventService.deleteEvent(id).subscribe(
      () => {
        this.events = this.events.filter(event => event.id !== id);
        this.successMessage = 'Event deleted successfully'; // Set the success message

        setTimeout(() => {
          this.successMessage = '';
        }, 2000);
      },
      error => {
        console.error('Error deleting event', error);
      }
    );
  }

  editEvent(id: number): void {
    this.router.navigate([`/edit/${id}`]);
  }

  addEvent(): void {
    this.router.navigate(['/add-event']);
  }
}