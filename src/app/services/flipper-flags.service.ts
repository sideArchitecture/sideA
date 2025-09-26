// feature-flags.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FlipperFlagsService {
  private flags: Record<string, boolean> = {};

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    return this.http.get<Record<string, boolean>>(environment.flipperFlagsFile)
      .toPromise()
      .then(flags => {
        this.flags = flags || {};
      })
      .catch(() => {
        console.warn('Could not load feature flags, falling back to defaults');
        this.flags = {};
      })
      .then(() => {}); // ensures Promise<void>
  }

  isEnabled(flag: string): boolean {
    return !!this.flags[flag];
  }
}
