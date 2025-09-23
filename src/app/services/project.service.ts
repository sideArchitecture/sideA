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
      category: [ProjectCategory.Commercial],
      notes: `SIDEA Tower redefines verticality with a minimalist approach.
      The structure is designed to optimize daylight, airflow, and spatial clarity.
      Its facade features rhythmic fenestration and modular panels that echo the brand’s ethos of precision and elegance.`
    },
    {
      id: 'forest-retreat',
      title: 'Forest Retreat',
      imageUrl: 'assets/projects/forest-retreat/cover.jpg',
      slug: 'forest-retreat',
      description: 'A serene residential escape nestled in nature.',
      category: [ProjectCategory.Residential],
      notes: `Forest Retreat is a meditative sanctuary that blends seamlessly into its wooded surroundings.
      The design prioritizes natural materials, passive cooling, and open-plan living to foster a deep connection with nature.`
    },
    {
      id: 'urban-courtyard',
      title: 'Urban Courtyard',
      imageUrl: 'assets/projects/urban-courtyard/cover.jpg',
      slug: 'urban-courtyard',
      description: 'An adaptive reuse project with cultural resonance.',
      category: [ProjectCategory.Cultural, ProjectCategory.Commercial],
      notes: `Urban Courtyard transforms a historic site into a vibrant mixed-use space.
      The project preserves key architectural elements while introducing modern interventions that support community engagement and cultural programming.`
    }
  ];

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }
}
