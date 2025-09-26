import { Component, OnInit } from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ProjectCategory } from '../../../models/project-category.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { gsap } from 'gsap';
import { FlipperFlagsService } from '../../../services/flipper-flags.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  allProjects: Project[] = [];
  projects: Project[] = [];
  selectedCategory: string = 'All';
  visibleProjects: Project[] = [];
  combinedResults: { type: 'category' | 'project'; value: any }[] = [];

  categoryCounts: { [key: string]: number } = {};
  filteredCategories: string[] = [];

  searchTerm = '';
  visibleCategories: string[] = [];
  showDropdown = false;
  lastConfirmedCategory: string = 'All';
  showCounts = true;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private flipperFlagsService: FlipperFlagsService
  ) {}

  ngOnInit(): void {
    document.addEventListener('click', this.handleOutsideClick.bind(this));

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

      this.searchTerm = this.getCategoryLabel(this.selectedCategory);
      this.lastConfirmedCategory = this.selectedCategory;

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

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  isSearchProjectsEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('searchProjects');
  }

  onInputClick(): void {
    this.searchTerm = '';
    this.visibleCategories = [...this.filteredCategories];
    this.visibleProjects = [];

    this.combinedResults = [
      ...this.visibleCategories.map(cat => ({ type: 'category' as const, value: cat }))
    ];

    this.showDropdown = true;
  }

  filterCategoryOptions(): void {
    const term = this.searchTerm.toLowerCase();

    const matchedCategories = this.filteredCategories.filter(cat =>
      this.getCategoryLabel(cat).toLowerCase().includes(term)
    );

    const matchedProjects = this.allProjects.filter(project =>
      project.title.toLowerCase().includes(term)
    );

    this.visibleCategories = matchedCategories;
    this.visibleProjects = matchedProjects;

    this.combinedResults = [
      ...matchedCategories.map(cat => ({ type: 'category' as const, value: cat })),
      ...matchedProjects.map(project => ({ type: 'project' as const, value: project }))
    ];

    this.showDropdown = true;
  }

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.position-relative')) {
      this.showDropdown = false;
      this.searchTerm = this.getCategoryLabel(this.lastConfirmedCategory);
      this.selectedCategory = this.lastConfirmedCategory;
    }
  }

  selectCategory(item: { type: 'category' | 'project'; value: any }): void {
    if (item.type === 'category') {
      this.selectedCategory = item.value;
      this.lastConfirmedCategory = item.value;
      this.searchTerm = this.getCategoryLabel(item.value);
      this.filterProjects();
    } else {
      this.router.navigate(['/projects', item.value.id], {
        queryParams: { category: this.selectedCategory }
      });
    }

    this.showDropdown = false;
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
