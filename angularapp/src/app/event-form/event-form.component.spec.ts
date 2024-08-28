import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EventFormComponent } from './event-form.component';
import { EventService } from '../service/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../model/event.model';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let eventService: EventService;
  let activatedRoute: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    const eventServiceStub = {
      getEventById: jasmine.createSpy('getEventById').and.returnValue(of({ id: 1, name: 'Test Event', description: 'Description', location: 'Location', date: '2024-12-31' } as unknown as Event)),
      createEvent: jasmine.createSpy('createEvent').and.returnValue(of({})),
      updateEvent: jasmine.createSpy('updateEvent').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [EventFormComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: EventService, useValue: eventServiceStub },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } } } },
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    eventService = TestBed.inject(EventService);
    activatedRoute = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('should create the form with default values', () => {
    expect(component.eventForm).toBeDefined();
    expect(component.eventForm.value).toEqual({
      id: null,
      name: '',
      description: '',
      location: '',
      date: ''
    });
    expect(component.isEditMode).toBeFalse();
  });

  fit('should set minDate to today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(component.minDate).toBe(today);
  });

  fit('should switch to edit mode when an id is provided', () => {
    activatedRoute.snapshot.paramMap.get = jasmine.createSpy().and.returnValue('1');
    component.ngOnInit();
    expect(component.isEditMode).toBeTrue();
    expect(eventService.getEventById).toHaveBeenCalledWith(1);
  });

  fit('should call createEvent on form submission in create mode', () => {
    component.isEditMode = false;
    component.eventForm.setValue({
      id: null,
      name: 'Test Event',
      description: 'Description',
      location: 'Location',
      date: '2024-12-31'
    });

    component.onSubmit();

    expect(eventService.createEvent).toHaveBeenCalledWith(component.eventForm.value);
    expect(component.successMessage).toBe('Event successfully created');
  });

  fit('should call updateEvent on form submission in edit mode', () => {
    component.isEditMode = true;
    component.eventForm.setValue({
      id: 1,
      name: 'Updated Event',
      description: 'Updated Description',
      location: 'Updated Location',
      date: '2024-12-31'
    });

    component.onSubmit();

    expect(eventService.updateEvent).toHaveBeenCalledWith(1, component.eventForm.value);
    expect(component.successMessage).toBe('Event successfully updated');
  });

  fit('should not submit the form if it is invalid', () => {
    component.eventForm.setValue({
      id: null,
      name: '',
      description: '',
      location: '',
      date: ''
    });

    component.onSubmit();

    expect(eventService.createEvent).not.toHaveBeenCalled();
    expect(eventService.updateEvent).not.toHaveBeenCalled();
  });

  fit('should display success message after event creation', () => {
    component.isEditMode = false;
    component.eventForm.setValue({
      id: null,
      name: 'Test Event',
      description: 'Description',
      location: 'Location',
      date: '2024-12-31'
    });

    component.onSubmit();

    expect(component.successMessage).toBe('Event successfully created');
    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/events']);
    }, 2000);
  });

  fit('should enforce minDate restriction on date input', () => {
    const dateInput = fixture.nativeElement.querySelector('input[type="date"]');
    expect(dateInput.min).toBe(component.minDate);
  });

  fit('should disable the submit button if the form is invalid', () => {
    component.eventForm.controls['name'].setValue('');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });
});