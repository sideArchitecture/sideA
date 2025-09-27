import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  private readonly manifestUrl = 'https://sidearchitecture.github.io/sideAImages/images/projects/manifest.json';

  constructor(private http: HttpClient) {}

  getAllProjects(): Observable<Project[]> {
    if (this.projects.length > 0) {
      return of(this.projects);
    }

    return this.http.get<Project[]>(this.manifestUrl).pipe(
      tap(data => this.projects = data),
      catchError(err => {
        console.error('Failed to load project manifest:', err);
        return of([]);
      })
    );
  }

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  // getProjectDetail(category: string, slug: string): Observable<Project | undefined> {
  //   const url = `https://sidearchitecture.github.io/sideAImages/images/projects/${category}/${slug}/manifest.json`;
  //   return this.http.get<Project>(url).pipe(
  //     catchError(err => {
  //       console.error(`Failed to load project detail for ${slug}:`, err);
  //       return of(undefined);
  //     })
  //   );
  // }

  private projectCache: { [key: string]: Project } = {};

  getProjectDetail(category: string, slug: string): Observable<Project | undefined> {
    const cacheKey = `${category}/${slug}`;
    if (this.projectCache[cacheKey]) {
      return of(this.projectCache[cacheKey]);
    }

    const url = `https://sidearchitecture.github.io/sideAImages/images/projects/${category}/${slug}/manifest.json`;
    return this.http.get<Project>(url).pipe(
      tap(project => {
        if (project) this.projectCache[cacheKey] = project;
      }),
      catchError(err => {
        console.error(`Failed to load project detail for ${slug}:`, err);
        return of(undefined);
      })
    );
  }


}
