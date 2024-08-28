import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventFormComponent } from './event-form/event-form.component';

const routes: Routes = [
  { path: 'events', component: EventListComponent },
  { path: 'events/add-event', component: EventFormComponent },
  { path: 'edit/:id', component: EventFormComponent },
  { path: '', redirectTo: '/events', pathMatch: 'full' },
  { path: '**', redirectTo: '/events' }  // Wildcard route for handling 404 cases
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }