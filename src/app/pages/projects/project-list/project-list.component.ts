import { Component, OnInit } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ProjectCategory } from '../../../models/project-category.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { gsap } from 'gsap';
@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  allProjects: Project[] = [];
  projects: Project[] = [];
  selectedCategory: string = 'All';

  categoryCounts: { [key: string]: number } = {};
  filteredCategories: string[] = [];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allProjects = this.projectService.getAllProjects();
    this.projects = [...this.allProjects];
    this.computeCategoryCounts();

    this.route.queryParamMap.subscribe(params => {
      const category = params.get('category');
      if (category && this.filteredCategories.includes(category)) {
        this.selectedCategory = category;
      } else {
        this.selectedCategory = 'All';
      }
      this.filterProjects();
    });
  }


  ngAfterViewInit(): void {
    gsap.from('.card', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out',
      stagger: 0.1
    });
  }


  computeCategoryCounts(): void {
    const counts: { [key: string]: number } = {};

    Object.values(ProjectCategory).forEach(cat => {
      counts[cat] = 0;
    });

    for (const project of this.allProjects) {
      if (Array.isArray(project.category)) {
        for (const cat of project.category) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      }
    }

    counts['All'] = this.allProjects.length;
    this.categoryCounts = counts;

    this.filteredCategories = Object.keys(counts)
      .filter(cat => counts[cat] > 0)
      .sort((a, b) => this.getCategoryLabel(a).localeCompare(this.getCategoryLabel(b)));
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

  showCounts =true;
  getCategoryLabel(cat: string): string {
    const titleCase = cat === 'All'
      ? 'All Projects'
      : cat
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    if (!this.showCounts) return titleCase;

    const count = this.categoryCounts[cat] ?? 0;
    return `${titleCase} (${count})`;
  }




}
