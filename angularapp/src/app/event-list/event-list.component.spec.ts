import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { EventListComponent } from './event-list.component';
import { EventService } from '../service/event.service';
import { Event } from '../model/event.model';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEvents', 'deleteEvent']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [EventListComponent],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;

    // Mock event data
    const eventsMock: Event[] = [
      { id: 1, name: 'Event 1', description: 'Description 1', location: 'Location 1', date: '2024-08-01' },
      { id: 2, name: 'Event 2', description: 'Description 2', location: 'Location 2', date: '2024-08-02' },
    ];

    eventService.getEvents.and.returnValue(of(eventsMock));
    eventService.deleteEvent.and.returnValue(of(void 0)); // Return Observable<void>

    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should load events on init', () => {
    expect(component.events.length).toBe(2);
    expect(component.events[0].name).toBe('Event 1');
    expect(eventService.getEvents).toHaveBeenCalled();
  });

  fit('should delete an event and update the list', () => {
    component.deleteEvent(1);

    expect(eventService.deleteEvent).toHaveBeenCalledWith(1);
    expect(component.events.length).toBe(1);
    expect(component.events.find(event => event.id === 1)).toBeUndefined();
    expect(component.successMessage).toBe('Event deleted successfully');
  });

  fit('should navigate to edit event', () => {
    component.editEvent(1);
    expect(router.navigate).toHaveBeenCalledWith(['/edit/1']);
  });

  fit('should navigate to add event', () => {
    component.addEvent();
    expect(router.navigate).toHaveBeenCalledWith(['/add-event']);
  });

  fit('should set successMessage when an event is deleted', () => {
    component.deleteEvent(1);
    fixture.detectChanges();

    expect(component.successMessage).toBe('Event deleted successfully');
  });
});