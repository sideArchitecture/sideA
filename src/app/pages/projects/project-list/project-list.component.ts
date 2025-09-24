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
  categories: string[] = ['All', ...Object.values(ProjectCategory)];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.allProjects = this.projectService.getAllProjects();
    this.projects = [...this.allProjects];
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

}
