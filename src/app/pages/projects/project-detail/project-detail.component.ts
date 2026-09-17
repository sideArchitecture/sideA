import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { gsap } from 'gsap';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { ProjectCategory } from '../../../models/project-category.enum';
import { FlipperFlagsService } from '../../../services/flipper-flags.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  project: Project | undefined;
  validImages: string[] = [];
  isLoading = true;
  isGalleryLoading = false;
  selectedImageIndex: number | null = null;
  selectedCategory: string | null = null;
  fromSource: string | null = null;
  fromSection: string | null = null;

  @ViewChild('zoomRef') zoomRef: any;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private titleService: Title,
    private flipperFlagsService: FlipperFlagsService
  ) {}

  fromHex(slug: string): string {
    const padded = slug + '='.repeat((4 - slug.length % 4) % 4);
    return atob(
      padded
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    );
  }

  ngOnInit(): void {
    const isUrlBase64Enabled = this.flipperFlagsService.isEnabled('urlBase64');
    const slugHex = this.route.snapshot.paramMap.get('id') ?? '';
    const slug = isUrlBase64Enabled ? this.fromHex(slugHex) : slugHex;
    this.selectedCategory = this.route.snapshot.queryParamMap.get('category');
    this.fromSource = this.route.snapshot.queryParamMap.get('from');
    this.fromSection = this.route.snapshot.queryParamMap.get('section');

    if (slug) {
      this.projectService.getProjectDetail(slug).subscribe((data) => {
        if (data) {
          this.project = data;
          this.isLoading = false;
          this.loadValidImages();

          const title = data.title ?? slug;
          this.titleService.setTitle(`${title} | SideA Architecture`);
        } else {
          this.isLoading = false;
          this.titleService.setTitle(`Project Not Found | SideA Architecture`);
        }
      });
    } else {
      this.isLoading = false;
      this.titleService.setTitle(`Project Not Found | SideA Architecture`);
    }
  }

  ngAfterViewInit(): void {
    gsap.from('.project-profile-card', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  getBackRoute(): string[] {
    return this.fromSource === 'home' ? ['/'] : ['/projects'];
  }

  getBackQueryParams(): any {
    if (this.fromSource === 'home') {
      return this.fromSection ? { section: this.fromSection } : {};
    }
    return { category: this.selectedCategory || 'All' };
  }

  getBackLabel(): string {
    return this.fromSource === 'home' ? 'Back to Home' : 'Back to Projects';
  }

  getCategoryDisplay(categories: ProjectCategory[]): string {
    return categories
      .filter((category) => category !== 'featured')
      .map((category) => this.toTitleCase(category))
      .join(', ');
  }

  toTitleCase(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  getCoverImageUrl(url: string | undefined): string {
    if (!url) return '';
    const isDev = !environment.production;
    const localBase = environment.imageBaseUrl;
    return isDev
      ? url.replace('https://sidearchitecture.github.io/sideAImages/images/projects', localBase)
      : url;
  }

  loadValidImages(): void {
    if (!this.project?.imageUrls?.length) {
      this.isGalleryLoading = false;
      return;
    }

    this.isGalleryLoading = true;
    const imageCount = this.project.imageUrls.length;
    const valid: (string | null)[] = new Array(imageCount).fill(null);
    let loadedCount = 0;

    const isDev = !environment.production;
    const localBase = environment.imageBaseUrl;

    this.project.imageUrls.forEach((path, index) => {
      const rewrittenPath = isDev
        ? path.replace('https://sidearchitecture.github.io/sideAImages/images/projects', localBase)
        : path;

      const img = new Image();
      img.onload = () => {
        valid[index] = rewrittenPath;
        loadedCount++;
        if (loadedCount === imageCount) {
          this.validImages = valid.filter(Boolean) as string[];
          this.isGalleryLoading = false;
          this.animateImages();
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === imageCount) {
          this.validImages = valid.filter(Boolean) as string[];
          this.isGalleryLoading = false;
          this.animateImages();
        }
      };
      img.src = rewrittenPath;
    });
  }

  private animateImages(): void {
    setTimeout(() => {
      gsap.from('.image-wrapper', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15
      });
    }, 10);
  }

  openLightbox(index: number): void {
    this.selectedImageIndex = index;
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (this.zoomRef?.reset) {
          this.zoomRef.reset();
        }
      });
    }, 100);
  }

  closeLightbox(): void {
    this.selectedImageIndex = null;
  }

  nextImage(): void {
    if (this.selectedImageIndex !== null && this.selectedImageIndex < this.validImages.length - 1) {
      this.selectedImageIndex++;
    }
  }

  prevImage(): void {
    if (this.selectedImageIndex !== null && this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }
}
