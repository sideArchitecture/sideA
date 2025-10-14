import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { Observable, of, switchMap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  // private readonly baseManifestUrl = 'https://sidearchitecture.github.io/sideAImages/images/projects/manifest.json';
  private readonly baseManifestUrl = `${environment.imageBaseUrl}/manifest.json`;


  constructor(private http: HttpClient) {}

  /**
   * Appends a cache-busting query param to any URL.
   */
  private bustCache(url: string): string {
    const timestamp = Date.now();
    return `${url}?v=${timestamp}`;
  }

  /**
   * Fetches all projects from the root manifest with cache busting.
   */
  getAllProjects(): Observable<Project[]> {
    const url = this.bustCache(this.baseManifestUrl);
    return this.http.get<Project[]>(url).pipe(
      catchError(err => {
        console.error('❌ Failed to load project manifest:', err);
        return of([]);
      })
    );
  }

  /**
   * Fetches full manifest for a single project using its slug.
   * Uses projectPath from root manifest for accurate folder resolution.
   */
  getProjectDetail(slug: string): Observable<Project | undefined> {
    const rootUrl = this.bustCache(this.baseManifestUrl);

    return this.http.get<Project[]>(rootUrl).pipe(
      switchMap((projects: Project[]) => {
        const match = projects.find(p => p.slug === slug);
        if (!match || !match.projectPath) {
          console.warn(`⚠️ Project with slug "${slug}" not found or missing projectPath.`);
          return of(undefined);
        }

        // const detailUrl = this.bustCache(
        //   `https://sidearchitecture.github.io/sideAImages/images/projects/${match.projectPath}/manifest.json`
        // );

        const detailUrl = this.bustCache(
          `${environment.imageBaseUrl}/${match.projectPath}/manifest.json`
        );


        return this.http.get<Project>(detailUrl).pipe(
          catchError(err => {
            console.error(`❌ Failed to load manifest for "${slug}" at ${detailUrl}:`, err);
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
