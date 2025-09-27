import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import {Observable, of, switchMap} from 'rxjs';
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

  getProjectDetail(slug: string): Observable<Project | undefined> {
    const rootManifestUrl = 'https://sidearchitecture.github.io/sideAImages/images/projects/manifest.json';

    return this.http.get<Project[]>(rootManifestUrl).pipe(
      switchMap((projects: Project[]) => {
        const match = projects.find(p => p.slug === slug);
        if (!match || !match.category?.length) {
          console.warn(`Project with slug "${slug}" not found in root manifest.`);
          return of(undefined);
        }

        const category = match.category[0]; // Use first category as canonical path
        const detailUrl = `https://sidearchitecture.github.io/sideAImages/images/projects/${category}/${slug}/manifest.json`;

        return this.http.get<Project>(detailUrl).pipe(
          catchError(err => {
            console.error(`Failed to load manifest for ${slug} in category ${category}:`, err);
            return of(undefined);
          })
        );
      }),
      catchError(err => {
        console.error('Failed to load root manifest:', err);
        return of(undefined);
      })
    );
  }



}
