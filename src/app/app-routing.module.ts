import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import {PeopleComponent} from "./pages/people/people.component";
import {ProjectsComponent} from "./pages/projects/projects.component";
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'projects/:id', component: ProjectDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true ,


    // scrollPositionRestoration: 'enabled', // ✅ restores scroll on back/forward
    // anchorScrolling: 'enabled' // optional: enables fragment scrolling
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
