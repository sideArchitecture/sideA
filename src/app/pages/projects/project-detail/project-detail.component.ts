import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';
import { gsap } from 'gsap';
import {Title} from "@angular/platform-browser";
import {environment} from "../../../../environments/environment";


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  validImages: string[] = [];
  isLoading = true;
  selectedImageIndex: number | null = null;

  @ViewChild('zoomRef') zoomRef: any;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router: Router,
    private titleService: Title,
  ) {}

  selectedCategory: string | null = null;

  ngOnInit(): void {

    const slug = this.route.snapshot.paramMap.get('id');
    this.selectedCategory = this.route.snapshot.queryParamMap.get('category');

    if (slug) {
      this.projectService.getProjectDetail(slug).subscribe(data => {
        this.project = data;
        this.isLoading = false;
        this.loadValidImages();
      });
    } else {
      this.isLoading = false;
    }

    this.titleService.setTitle(`${slug} | SideA Architecture`);

  }


  ngAfterViewInit(): void {

    gsap.from('.project-profile', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out'
    });
  }

  getCoverImageUrl(url: string): string {
    const isDev = !environment.production;
    const localBase = 'http://localhost:8081/projects';
    return isDev
      ? url.replace('https://sidearchitecture.github.io/sideAImages/images/projects', localBase)
      : url;
  }


  loadValidImages(): void {
    if (!this.project?.imageUrls?.length) return;

    const imageCount = this.project.imageUrls.length;
    const valid: (string | null)[] = new Array(imageCount).fill(null);
    let loadedCount = 0;

    const isDev = !environment.production;
    const localBase = 'http://localhost:8081/projects';

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
            this.animateImages();
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === imageCount) {
            this.validImages = valid.filter(Boolean) as string[];
            this.animateImages();
          }
        };
        img.src = rewrittenPath;
      }
    );
  }


  private animateImages(): void {
    setTimeout(() => {
      gsap.from('.project-image', {
        opacity: 0,
        scale: 0.95,
        duration: 2,
        ease: 'power2.out',
        stagger: 0.4
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
