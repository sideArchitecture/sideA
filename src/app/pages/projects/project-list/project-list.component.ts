import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../models/project.model';
import {ProjectService} from '../../../services/project.service';
import {ProjectCategory} from '../../../models/project-category.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {gsap} from 'gsap';
import {FlipperFlagsService} from '../../../services/flipper-flags.service';
import { Title } from '@angular/platform-browser';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy, AfterViewInit {
  allProjects: Project[] = [];
  projects: Project[] = [];
  selectedCategory: string = 'All';
  visibleProjects: Project[] = [];
  combinedResults: { type: 'category' | 'project'; value: any }[] = [];
  isLoading = true;

  categoryCounts: { [key: string]: number } = {};
  filteredCategories: string[] = [];

  searchTerm = '';
  visibleCategories: string[] = [];
  showDropdown = false;
  lastConfirmedCategory: string = 'All';
  showCounts = true;

  constructor(
    public projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private flipperFlagsService: FlipperFlagsService,
    private titleService: Title,
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Projects | SideA Architecture');

    document.addEventListener('click', this.handleOutsideClick.bind(this));

    this.projectService.getAllProjects().subscribe(projects => {
      this.allProjects = projects;
      this.isLoading = false;
      this.computeCategoryCounts();

      this.route.queryParamMap.subscribe(params => {
        const category = params.get('category');
        const search = params.get('search');

        this.selectedCategory = category && this.filteredCategories.includes(category)
          ? category
          : (this.filteredCategories.includes('featured') ? 'featured' : 'All');

        // 👇 Add this block right here
        if (!category) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {category: this.selectedCategory},
            queryParamsHandling: 'merge'
          });
        }

        this.searchTerm = search ?? this.getCategoryLabel(this.selectedCategory);
        this.lastConfirmedCategory = this.selectedCategory;
        this.filterProjects();
      });
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

  getCoverImageUrl(url: string | undefined): string {
    if (!url) return ''; // or return a fallback image URL if you prefer

    const isDev = !environment.production;
    const localBase = 'http://localhost:8081/projects';
    return isDev
      ? url.replace('https://sidearchitecture.github.io/sideAImages/images/projects', localBase)
      : url;
  }



  animateCards(): void {
    setTimeout(() => {
      gsap.from('.card', {opacity: 0, y: 30, duration: 1, ease: 'power2.out', stagger: 0.1});
    }, 0);
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
      ...this.visibleCategories.map(cat => ({type: 'category' as const, value: cat}))
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
      ...matchedCategories.map(cat => ({type: 'category' as const, value: cat})),
      ...matchedProjects.map(project => ({type: 'project' as const, value: project}))
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
        queryParams: {category: this.selectedCategory}
      });
    }

    this.showDropdown = false;
  }

  computeCategoryCounts(): void {
    const counts: { [key: string]: number } = {};

    for (const project of this.allProjects) {
      if (Array.isArray(project.category)) {
        for (const cat of project.category) {
          counts[cat] = (counts[cat] || 0) + 1;
        }
      }
    }

    counts['All'] = this.allProjects.length;
    this.categoryCounts = counts;

    const sorted = Object.keys(counts)
      .filter(cat => cat !== 'All')
      .sort((a, b) => {
        const indexA = this.getSortIndexForCategory(a);
        const indexB = this.getSortIndexForCategory(b);

        return indexA === indexB
          ? a.localeCompare(b)
          : indexA - indexB;
      });

    this.filteredCategories = ['All', ...sorted];
  }

  filterProjects(): void {
    this.projects = this.selectedCategory === 'All'
      ? [...this.allProjects]
      : this.allProjects.filter(project =>
        Array.isArray(project.category) &&
        project.category.includes(this.selectedCategory as ProjectCategory)
      );
    this.animateCards();
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

  getSortIndexForCategory(cat: string): number {
    const matchingProject = this.allProjects.find(p =>
      p.projectPath?.toLowerCase().includes(cat.toLowerCase())
    );

    if (matchingProject?.projectPath) {
      const match = matchingProject.projectPath.match(/^(\d+)-/);
      return match ? parseInt(match[1], 10) : Infinity;
    }

    return Infinity;
  }

}
