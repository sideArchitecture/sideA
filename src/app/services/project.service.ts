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
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      slug: 'forest-retreat',
      description: 'A serene residential escape nestled in nature.',
      category: [ProjectCategory.Residential],
      notes: `Forest Retreat is a meditative sanctuary that blends seamlessly into its wooded surroundings.
      The design prioritizes natural materials, passive cooling, and open-plan living to foster a deep connection with nature.`,
      imageUrls: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
        'https://images.unsplash.com/photo-1499696011070-5d4c4f3e4f9c'
      ]
    },
    {
      id: 'urban-courtyard',
      title: 'Urban Courtyard',
      imageUrl: 'https://images.unsplash.com/photo-1599423300746-b62533397364',
      slug: 'urban-courtyard',
      description: 'An adaptive reuse project with cultural resonance.',
      category: [ProjectCategory.Cultural, ProjectCategory.Commercial],
      notes: `Urban Courtyard transforms a historic site into a vibrant mixed-use space.
      The project preserves key architectural elements while introducing modern interventions that support community engagement and cultural programming.`,
      imageUrls: [
        'https://images.unsplash.com/photo-1599423300746-b62533397364',
        'https://images.unsplash.com/photo-1588854337225-1c1d7b8f9b3e',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        'https://images.unsplash.com/photo-1600585154207-6c2f4f3e4f9c'
      ]
    }
  ];

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getAllProjects(): Project[] {
    return this.projects;
  }
}
