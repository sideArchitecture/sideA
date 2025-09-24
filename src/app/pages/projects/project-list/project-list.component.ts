import { Component, OnInit } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ProjectCategory } from '../../../models/project-category.enum';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  allProjects: Project[] = [];
  projects: Project[] = [];
  selectedCategory: string = 'All';

  // Map of category name to count
  categoryCounts: { [key: string]: number } = {};

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.allProjects = this.projectService.getAllProjects();
    this.projects = [...this.allProjects];
    this.computeCategoryCounts();
  }

  computeCategoryCounts(): void {
    const counts: { [key: string]: number } = {};

    // Initialize counts
    Object.values(ProjectCategory).forEach(cat => {
      counts[cat] = 0;
    });

    // Count each category
    for (const project of this.allProjects) {
      if (Array.isArray(project.category)) {
        for (const cat of project.category) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      }
    }

    // Add "All" count
    counts['All'] = this.allProjects.length;

    this.categoryCounts = counts;
  }

  filterProjects(): void {
    if (this.selectedCategory === 'All') {
      this.projects = [...this.allProjects];
    } else {
      this.projects = this.allProjects.filter(project =>
        Array.isArray(project.category) &&
        project.category.includes(this.selectedCategory as ProjectCategory)
      );
    }
  }

  getCategoryLabel(cat: string): string {
    const count = this.categoryCounts[cat] ?? 0;
    return `${cat} (${count})`;
  }

  get categories(): string[] {
    return ['All', ...Object.values(ProjectCategory)];
  }
}
