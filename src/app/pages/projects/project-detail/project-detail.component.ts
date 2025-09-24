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
  // getProjectImages11(): string[] {
  //   if (!this.project) return [];
  //
  //   // Use external URLs if provided
  //   if (this.project.imageUrls && this.project.imageUrls.length > 0) {
  //     return this.project.imageUrls;
  //   }
  //
  //   // Fallback to local assets
  //   const basePath = `assets/projects/${this.project.id}/`;
  //   return [
  //     `${basePath}image1.jpg`,
  //     `${basePath}image2.jpg`,
  //     // Add more if needed
  //   ];
  // }

  validImages: string[] = [];

  loadValidImages(): void {
    const paths = this.getProjectImagesRaw(); // returns all possible paths
    const valid: string[] = [];

    paths.forEach(path => {
      const img = new Image();
      img.onload = () => {
        valid.push(path);
        this.validImages = [...valid]; // trigger change detection
      };
      img.onerror = () => {
        // do nothing — skip broken image
      };
      img.src = path;
    });
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







  // getProjectImages(): string[] {
  //   if (!this.project) return [];
  //
  //   if (this.project.imageUrls && this.project.imageUrls.length > 0) {
  //     return this.project.imageUrls;
  //   }
  //
  //   const basePath = `assets/projects/${this.project.id}/`;
  //   const count = this.project.imageCount || 0;
  //   const extensions = ['jpg', 'jpeg', 'png'];
  //
  //   const imagePaths: string[] = [];
  //
  //   for (let i = 1; i <= count; i++) {
  //     for (const ext of extensions) {
  //       const path = `${basePath}image${i}.${ext}`;
  //       imagePaths.push(path); // Push all possible variants
  //     }
  //   }
  //
  //   return imagePaths;
  // }
}
