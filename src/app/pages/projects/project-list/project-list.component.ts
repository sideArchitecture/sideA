import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { gsap } from 'gsap';
import { FlipperFlagsService } from '../../../services/flipper-flags.service';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

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
  highlightedProjectId: string | null = null;

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
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Projects | SideA Architecture');
    document.addEventListener('click', this.handleOutsideClick.bind(this));

    this.projectService.getAllProjects().subscribe((projects) => {
      this.allProjects = projects || [];
      this.isLoading = false;
      this.computeCategoryCounts();

      this.route.queryParamMap.subscribe((params) => {
        const categoryParam = params.get('category');
        const searchParam = params.get('search');

        let matchedCategory = 'All';
        if (categoryParam) {
          const found = this.filteredCategories.find(
            (c) => c.toLowerCase() === categoryParam.toLowerCase()
          );
          if (found) {
            matchedCategory = found;
          }
        }

        this.selectedCategory = matchedCategory;

        if (!categoryParam) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { category: this.selectedCategory },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        }

        if (searchParam !== null && searchParam !== undefined) {
          this.searchTerm = searchParam;
        }

        this.lastConfirmedCategory = this.selectedCategory;
        this.filterProjects();
      });
    });
  }

  ngAfterViewInit(): void {
    this.animateCards();
  }

  navigateToProject(project: Project): void {
    const scrollY = window.scrollY;
    sessionStorage.setItem('scrollRestorePending', 'true');
    sessionStorage.setItem('scrollY', scrollY.toString());
    sessionStorage.setItem('highlightProjectId', project.id);
    const isUrlBase64Enabled = this.flipperFlagsService.isEnabled('urlBase64');

    if (isUrlBase64Enabled) {
      this.router.navigate(['/projects', project.slugHex], {
        queryParams: { category: this.selectedCategory }
      });
    } else {
      this.router.navigate(['/projects', project.slug], {
        queryParams: { category: this.selectedCategory }
      });
    }
  }

  filterProjects(): void {
    const term = this.searchTerm.toLowerCase().trim();

    // 1. Filter by Category
    let list = this.selectedCategory === 'All'
      ? [...this.allProjects]
      : this.allProjects.filter((project) =>
          Array.isArray(project.category) &&
          project.category.some((c) => c.toLowerCase() === this.selectedCategory.toLowerCase())
        );

    // 2. Real-time Filter by Search Term
    if (term) {
      list = list.filter((p) => {
        const titleMatch = p.title && p.title.toLowerCase().includes(term);
        const locationMatch = p.location && p.location.toLowerCase().includes(term);
        const descMatch = p.description && p.description.toLowerCase().includes(term);
        const clientMatch = p.client && p.client.toLowerCase().includes(term);
        const styleMatch = p.designStyle && p.designStyle.toLowerCase().includes(term);
        const catMatch = Array.isArray(p.category) && p.category.some((c) => c.toLowerCase().includes(term));

        return titleMatch || locationMatch || descMatch || clientMatch || styleMatch || catMatch;
      });
    }

    this.projects = list;
    this.animateCards();

    const restoreScrollIfReady = () => {
      const cards = document.querySelectorAll('.project-card');
      if (cards.length > 0) {
        const scrollY = sessionStorage.getItem('scrollY');
        const restoreFlag = sessionStorage.getItem('scrollRestorePending');

        if (scrollY && restoreFlag === 'true') {
          window.scrollTo({ top: parseInt(scrollY, 10), behavior: 'auto' });
          sessionStorage.removeItem('scrollY');
          sessionStorage.removeItem('scrollRestorePending');
        }
      } else {
        setTimeout(restoreScrollIfReady, 50);
      }
    };
    setTimeout(restoreScrollIfReady, 50);
  }

  onSearchInput(): void {
    this.filterProjects();
    this.filterCategoryOptions();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.showDropdown = false;
    this.filterProjects();
  }

  selectCategoryName(category: string): void {
    if (this.selectedCategory === category && !this.searchTerm) return;
    this.selectedCategory = category;
    this.showDropdown = false;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: this.selectedCategory },
      queryParamsHandling: 'merge'
    });

    const cards = document.querySelectorAll('.project-card');
    if (cards.length > 0) {
      gsap.to('.project-card', {
        opacity: 0,
        y: -8,
        duration: 0.16,
        ease: 'power2.in',
        onComplete: () => {
          this.filterProjects();
        }
      });
    } else {
      this.filterProjects();
    }
  }

  selectCategory(item: { type: 'category' | 'project'; value: any }): void {
    if (item.type === 'category') {
      this.searchTerm = '';
      this.selectCategoryName(item.value);
    } else {
      const scrollY = window.scrollY;
      sessionStorage.setItem('scrollRestorePending', 'true');
      sessionStorage.setItem('scrollY', scrollY.toString());

      const isUrlBase64Enabled = this.flipperFlagsService.isEnabled('urlBase64');
      if (isUrlBase64Enabled) {
        this.router.navigate(['/projects', item.value.slugHex], {
          queryParams: { category: this.selectedCategory }
        });
      } else {
        this.router.navigate(['/projects', item.value.slug], {
          queryParams: { category: this.selectedCategory }
        });
      }
    }
    this.showDropdown = false;
  }

  getCoverImageUrl(url: string | undefined): string {
    if (!url) return '';
    const isDev = !environment.production;
    const localBase = environment.imageBaseUrl;
    return isDev
      ? url.replace('https://sidearchitecture.github.io/sideAImages/images/projects', localBase)
      : url;
  }

  getPrimaryCategory(project: Project): string {
    if (!project.category || !project.category.length) return '';
    const nonFeatured = project.category.find((c) => c !== 'featured');
    const cat = nonFeatured || project.category[0];
    return cat ? cat.replace(/_/g, ' ') : '';
  }

  animateCards(): void {
    setTimeout(() => {
      gsap.fromTo(
        '.project-card',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out', stagger: 0.03 }
      );
    }, 30);
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
      .filter((cat) => cat !== 'All')
      .sort((a, b) => {
        const indexA = this.getSortIndexForCategory(a);
        const indexB = this.getSortIndexForCategory(b);
        return indexA === indexB ? a.localeCompare(b) : indexA - indexB;
      });

    this.filteredCategories = ['All', ...sorted];
  }

  onInputClick(): void {
    this.visibleCategories = [...this.filteredCategories];
    this.visibleProjects = [];

    this.combinedResults = [
      ...this.visibleCategories.map((cat) => ({ type: 'category' as const, value: cat }))
    ];

    if (this.searchTerm) {
      this.showDropdown = true;
    }
  }

  filterCategoryOptions(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.showDropdown = false;
      return;
    }

    const matchedCategories = this.filteredCategories.filter((cat) =>
      this.getCategoryLabel(cat).toLowerCase().includes(term)
    );

    const matchedProjects = this.allProjects.filter((project) =>
      project.title.toLowerCase().includes(term)
    );

    this.visibleCategories = matchedCategories;
    this.visibleProjects = matchedProjects;

    this.combinedResults = [
      ...matchedCategories.map((cat) => ({
        type: 'category' as const,
        value: cat
      })),
      ...matchedProjects.map((project) => ({
        type: 'project' as const,
        value: project
      }))
    ];

    this.showDropdown = this.combinedResults.length > 0;
  }

  handleOutsideClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-box-wrapper')) {
      this.showDropdown = false;
    }
  }

  getCategoryLabel(cat: string): string {
    const titleCase = cat === 'All'
      ? 'All Projects'
      : cat
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    if (!this.showCounts) return titleCase;

    const count = this.categoryCounts[cat] ?? 0;
    return `${titleCase} (${count})`;
  }

  getCategoryTitleOnly(cat: string): string {
    if (cat === 'All') return 'All Projects';
    return cat
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getCategoryCountOnly(cat: string): number {
    return this.categoryCounts[cat] ?? 0;
  }

  getSortIndexForCategory(cat: string): number {
    const matchingProject = this.allProjects.find((p) =>
      p.projectPath?.toLowerCase().includes(cat.toLowerCase())
    );

    if (matchingProject?.projectPath) {
      const match = matchingProject.projectPath.match(/^(\d+)-/);
      return match ? parseInt(match[1], 10) : Infinity;
    }

    return Infinity;
  }

  isSearchProjectsEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('searchProjects');
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }
}
