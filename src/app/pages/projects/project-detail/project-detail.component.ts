import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  validImages: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.project = this.projectService.getProjectById(id);
      this.loadValidImages();
    }
  }

  getProjectImagesRaw(): string[] {
    if (!this.project) return [];

    if (this.project.imageUrls?.length) {
      return this.project.imageUrls;
    }

    const basePath = `assets/projects/${this.project.id}/`;
    const count = this.project.imageCount || 0;
    const extensions = ['jpg', 'jpeg', 'png'];

    const imagePaths: string[] = [];

    for (let i = 1; i <= count; i++) {
      for (const ext of extensions) {
        imagePaths.push(`${basePath}image${i}.${ext}`);
      }
    }

    return imagePaths;
  }

  loadValidImages(): void {
    const paths = this.getProjectImagesRaw();
    const valid: string[] = [];

    paths.forEach(path => {
      const img = new Image();
      img.onload = () => {
        valid.push(path);
        this.validImages = [...valid]; // trigger change detection
      };
      img.onerror = () => {
        // skip broken image
      };
      img.src = path;
    });
  }


  selectedImageIndex: number | null = null;

  openLightbox(index: number): void {
    this.selectedImageIndex = index;
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
