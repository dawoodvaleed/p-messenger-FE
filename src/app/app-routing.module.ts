import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Containers/login/login.component';
import { ThreadsComponent } from './Containers/threads/threads.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'mychat', component: ThreadsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
