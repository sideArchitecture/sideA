import { Injectable, NgModule } from '@angular/core';
import { DefaultUrlSerializer, RouterModule, Routes, UrlSegment, UrlSegmentGroup, UrlSerializer, UrlTree } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PeopleComponent } from './pages/people/people.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';

@Injectable()
export class CustomUrlSerializer extends DefaultUrlSerializer {
  override parse(url: string): UrlTree {
    // Strip trailing slashes before query parameters (e.g. /projects/?category=All -> /projects?category=All)
    const cleanedUrl = url.replace(/\/+(\?.*)?$/, '$1') || '/';
    return super.parse(cleanedUrl);
  }
}

export function projectDetailMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: any) {
  if (segments.length === 2 && segments[0].path === 'projects' && segments[1].path.trim() !== '') {
    return {
      consumed: segments,
      posParams: { id: segments[1] }
    };
  }
  return null;
}

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'people', component: PeopleComponent },
  { path: 'projects', component: ProjectsComponent },
  { matcher: projectDetailMatcher, component: ProjectDetailComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: false,
      anchorScrolling: 'enabled'
    })
  ],
  providers: [
    { provide: UrlSerializer, useClass: CustomUrlSerializer }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
