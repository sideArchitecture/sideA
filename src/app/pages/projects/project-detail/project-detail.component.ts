import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../../services/project.service';
import {Project} from '../../../models/project.model';
import {gsap} from 'gsap';
import {HttpClient} from '@angular/common/http';


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
    private projectService: ProjectService,
    private http: HttpClient,
    private router: Router
  ) {
  }

  selectedCategory: string | null = null;

  ngOnInit(): void {
    this.selectedCategory = this.route.snapshot.queryParamMap.get('category');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.project = this.projectService.getProjectById(id);
      this.loadValidImages();
    }
  }

  ngAfterViewInit(): void {
    gsap.from('.project-profile', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.project-image', {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.5
    });
  }


  getProjectImagesRaw(): Promise<string[]> {
    if (!this.project) return Promise.resolve([]);

    // ✅ Priority 1: Direct image URLs from service
    if (this.project.imageUrls?.length) {
      return Promise.resolve(this.project.imageUrls);
    }

    // ✅ Priority 2: Manifest-based local assets
    const basePath = `assets/projects/${this.project.id}/`;
    const manifestPath = `${basePath}manifest.json`;

    return this.http.get<{ images: string[] }>(manifestPath).toPromise()
      .then((manifest) => {
        if (manifest?.images?.length) {
          return manifest.images.map((img: string) => `${basePath}${img}`);
        }
        return [];
      })
      .catch(() => {
        // ✅ Priority 3: Fallback to guessed extensions
        const count = 0;
        const extensions = ['jpg', 'jpeg', 'png'];
        const imagePaths: string[] = [];

        for (let i = 1; i <= count; i++) {
          for (const ext of extensions) {
            imagePaths.push(`${basePath}image${i}.${ext}`);
          }
        }

        return imagePaths;
      });
  }


  async loadValidImages(): Promise<void> {
    const paths = await this.getProjectImagesRaw();
    const valid: string[] = [];
    let loadedCount = 0;

    paths.forEach(path => {
      const img = new Image();
      img.onload = () => {
        valid.push(path);
        loadedCount++;
        if (loadedCount === paths.length) {
          this.validImages = [...valid];
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
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === paths.length) {
          this.validImages = [...valid];
          setTimeout(() => {
            gsap.from('.project-image', {
              opacity: 0,
              scale: 0.95,
              duration: 2,
              ease: 'power2.out',
              stagger: 0.4
            });
          }, 0);
        }
      };
      img.src = path;
    });
  }


  selectedImageIndex: number | null = null;

  @ViewChild('zoomRef') zoomRef: any;

  openLightbox(index: number) {
    this.selectedImageIndex = index;

    // Wait for layout + orientation to settle
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (this.zoomRef?.reset) {
          this.zoomRef.reset(); // Force zoom reset
        }
      });
    }, 100); // Slight delay ensures DOM is ready
  }


  closeLightbox(): void {
    this.selectedImageIndex = null;
  }

  nextImage(): void {
    console.log("next swiped");
    if (this.selectedImageIndex !== null && this.selectedImageIndex < this.validImages.length - 1) {
      this.selectedImageIndex++;
    }
  }

  prevImage(): void {
    console.log("prev swiped");

    if (this.selectedImageIndex !== null && this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    }
  }
}
