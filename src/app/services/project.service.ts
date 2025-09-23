import { Injectable } from '@angular/core';
import { Project } from '../models/project.model';
import { ProjectCategory } from '../models/project-category.enum';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [
    {
      id: 'sidea-tower',
      title: 'SIDEA Tower',
      imageUrl: 'assets/projects/sidea-tower/cover.jpg',
      slug: 'sidea-tower',
      description: 'A minimalist high-rise blending form and function.',
      category: [ProjectCategory.Commercial]
    },
    {
      id: 'forest-retreat',
      title: 'Forest Retreat',
      imageUrl: 'assets/projects/forest-retreat/cover.jpg',
      slug: 'forest-retreat',
      description: 'A serene residential escape nestled in nature.',
      category: [ProjectCategory.Residential]
    },
    {
      id: 'urban-courtyard',
      title: 'Urban Courtyard',
      imageUrl: 'assets/projects/urban-courtyard/cover.jpg',
      slug: 'urban-courtyard',
      description: 'An adaptive reuse project with cultural resonance.',
      category: [ProjectCategory.Cultural, ProjectCategory.Commercial]
    }
  ];

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}
