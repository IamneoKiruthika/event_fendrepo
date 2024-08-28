import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../service/event.service';
import { Event } from '../model/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  successMessage: string = '';
  minDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadEventDetails(+id);
    }
  }

  private loadEventDetails(id: number): void {
    this.eventService.getEventById(id).subscribe(
      (event: Event) => this.eventForm.patchValue(event),
      error => console.error('Error fetching event', error)
    );
  }

  onSubmit(): void {
    if (this.eventForm.invalid) return;

    if (this.isEditMode) {
      this.updateEvent();
    } else {
      this.createEvent();
    }
  }

  private updateEvent(): void {
    const eventId = this.eventForm.value.id;
    this.eventService.updateEvent(eventId, this.eventForm.value).subscribe(
      response => {
        this.successMessage = 'Event successfully updated';
        setTimeout(() => {
          this.router.navigate(['/events']);
        }, 2000);
      },
      error => console.error('Error updating event', error)
    );
  }
  
  private createEvent(): void {
    this.eventService.createEvent(this.eventForm.value).subscribe(
      response => {
        this.successMessage = 'Event successfully created';
        setTimeout(() => {
          this.router.navigate(['/events']);
        }, 2000); // Delay of 2 seconds
      },
      error => console.error('Error creating event', error)
    );
  }  
}
