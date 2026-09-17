import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  NgZone
} from '@angular/core';
import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { ProjectCategory } from '../../../models/project-category.enum';
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
    private titleService: Title,
    private ngZone: NgZone
  ) {}

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

        if (!category) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { category: this.selectedCategory },
            queryParamsHandling: 'merge'
          });
        }

        this.searchTerm = search ?? '';
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
    this.isLoading = true;
    this.projects = this.selectedCategory === 'All'
      ? [...this.allProjects]
      : this.allProjects.filter(project =>
        Array.isArray(project.category) &&
        project.category.includes(this.selectedCategory as ProjectCategory)
      );

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
    setTimeout(() => {
      this.isLoading = false;
      restoreScrollIfReady();
    }, 0);
  }

  selectCategoryName(category: string): void {
    this.searchTerm = '';
    this.showDropdown = false;
    this.router.navigate(['/projects'], {
      queryParams: { category }
    });
  }

  selectCategory(item: { type: 'category' | 'project'; value: any }): void {
    if (item.type === 'category') {
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
    const nonFeatured = project.category.find(c => c !== 'featured');
    const cat = nonFeatured || project.category[0];
    return cat ? cat.replace(/_/g, ' ') : '';
  }

  animateCards(): void {
    setTimeout(() => {
      gsap.from('.project-card', {
        opacity: 0,
        y: 25,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08
      });
    }, 10);
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
        return indexA === indexB ? a.localeCompare(b) : indexA - indexB;
      });

    this.filteredCategories = ['All', ...sorted];
  }

  onInputClick(): void {
    this.visibleCategories = [...this.filteredCategories];
    this.visibleProjects = [];

    this.combinedResults = [
      ...this.visibleCategories.map(cat => ({ type: 'category' as const, value: cat }))
    ];

    this.showDropdown = true;
  }

  filterCategoryOptions(): void {
    const term = this.searchTerm.toLowerCase().trim();

    const matchedCategories = this.filteredCategories.filter(cat =>
      this.getCategoryLabel(cat).toLowerCase().includes(term)
    );

    const matchedProjects = term
      ? this.allProjects.filter(project =>
        project.title.toLowerCase().includes(term)
      )
      : [];

    this.visibleCategories = matchedCategories;
    this.visibleProjects = matchedProjects;

    this.combinedResults = [
      ...matchedCategories.map(cat => ({
        type: 'category' as const,
        value: cat
      })),
      ...matchedProjects.map(project => ({
        type: 'project' as const,
        value: project
      }))
    ];

    this.showDropdown = true;
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
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getCategoryCountOnly(cat: string): number {
    return this.categoryCounts[cat] ?? 0;
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

  isSearchProjectsEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('searchProjects');
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }
}
