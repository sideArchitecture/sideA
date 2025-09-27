import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable, of, switchMap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly manifestUrl = 'https://sidearchitecture.github.io/sideAImages/images/projects/manifest.json';

  constructor(private http: HttpClient) {}

  /**
   * Fetches all projects from the root manifest.
   */
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.manifestUrl).pipe(
      catchError(err => {
        console.error('❌ Failed to load project manifest:', err);
        return of([]);
      })
    );
  }

  /**
   * Fetches full manifest for a single project using its slug.
   * Resolves correct folder path using root manifest.
   */
  getProjectDetail(slug: string): Observable<Project | undefined> {
    return this.http.get<Project[]>(this.manifestUrl).pipe(
      switchMap((projects: Project[]) => {
        const match = projects.find(p => p.slug === slug);
        if (!match || !match.category?.length) {
          console.warn(`⚠️ Project with slug "${slug}" not found in root manifest.`);
          return of(undefined);
        }

        const category = match.category[0];
        const detailUrl = `https://sidearchitecture.github.io/sideAImages/images/projects/${category}/${slug}/manifest.json`;

        return this.http.get<Project>(detailUrl).pipe(
          catchError(err => {
            console.error(`❌ Failed to load manifest for ${slug} in category ${category}:`, err);
            return of(undefined);
          })
        );
      }),
      catchError(err => {
        console.error('❌ Failed to load root manifest:', err);
        return of(undefined);
      })
    );
  }

  /**
   * Optional helper for legacy templates (if needed).
   * Not required if manifest already includes full image URLs.
   */
  getCoverImageUrl(project: Project): string {
    return project?.imageUrl || '';
  }
}
