import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  ViewChild,
  QueryList,
  AfterViewInit,
  OnDestroy,
  NgZone
} from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FlipperFlagsService } from '../../services/flipper-flags.service';

export interface FullpageProject {
  id: string;
  number: string;
  title: string;
  category: string;
  location: string;
  year: string;
  client?: string;
  designStyle?: string;
  builtStatus?: string;
  description: string;
  imageUrl: string;
  slug: string;
  slugHex: string;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface WireframeMesh {
  vertices: Point3D[];
  edges: [number, number][];
  center: Point3D;
  rotX: number;
  rotY: number;
  rotZ: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('blueprintCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;

  activeSectionIndex = 0;
  private observer?: IntersectionObserver;
  private animFrameId?: number;

  // Interactive Canvas State
  private mouseX = 0;
  private mouseY = 0;
  private targetRotX = 0;
  private targetRotY = 0;
  private currentRotX = 0;
  private currentRotY = 0;
  private meshes: WireframeMesh[] = [];
  private particles: { x: number; y: number; z: number; vx: number; vy: number }[] = [];

  projects: FullpageProject[] = [
    {
      id: 'HOSPITALITY-001-ADALI-RESORT',
      number: '01',
      title: 'Adali Cultural Center',
      category: 'Institutional & Hospitality',
      location: 'Palakonda, AP',
      year: '2018',
      client: 'Govt. of Andhra Pradesh',
      designStyle: 'Contemporary Chalet',
      builtStatus: 'Unbuilt',
      description: 'Chalet-inspired cultural sanctuary crafted for the Government of Andhra Pradesh in Palakonda.',
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/1.jpg',
      slug: 'HOSPITALITY-001-ADALI-RESORT',
      slugHex: 'SE9TUElUQUxJVFktMDAxLUFEQUxJLVJFU09SVA'
    },
    {
      id: 'COMMERCIAL-001-GCC',
      number: '02',
      title: 'Girijana Commercial Complex',
      category: 'Commercial Architecture',
      location: 'Palakonda, AP',
      year: '2019',
      client: 'Govt. of Andhra Pradesh',
      designStyle: 'Contemporary',
      builtStatus: 'Built',
      description: 'Contemporary commercial hub and community marketplace for the Govt. of Andhra Pradesh.',
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/2.jpg',
      slug: 'COMMERCIAL-001-GCC',
      slugHex: 'Q09NTUVSQ0lBTC0wMDEtR0ND'
    },
    {
      id: 'MORE-001-MEMORIAL-DESIGN',
      number: '03',
      title: 'Memorial Ghat',
      category: 'Monument & Public Space',
      location: 'Kadapa, AP',
      year: '2022',
      designStyle: 'Neo Classical',
      builtStatus: 'Unbuilt',
      description: 'Neo-classical riverside monumental landscape and serene civic reflection space.',
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/3.jpg',
      slug: 'MORE-001-MEMORIAL-DESIGN',
      slugHex: 'TU9SRS0wMDEtTUVNT1JJQUwtREVTSUdO'
    },
    {
      id: 'OFFICE-002-TUDA-CONFERENCE',
      number: '04',
      title: 'TUDA Conference Hall',
      category: 'Civic & Office Interiors',
      location: 'Tirupati, AP',
      year: '2018',
      designStyle: 'Modern',
      builtStatus: 'Built',
      description: 'Modern administrative conference hall and civic interior design for Tirupati Urban Development Authority.',
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/4.jpg',
      slug: 'OFFICE-002-TUDA-CONFERENCE',
      slugHex: 'T0ZGSUNFLTAwMi1UVURBLUNPTkZFUkVOQ0U'
    },
    {
      id: 'RESIDENCE-003-SUNRISE-VISTARA',
      number: '05',
      title: 'Sunrise Vistara',
      category: 'Residential Architecture',
      location: 'Visakhapatnam, AP',
      year: '2023',
      designStyle: 'Contemporary',
      builtStatus: 'Built',
      description: 'Contemporary multi-residential living emphasizing natural daylight and coastal cross-ventilation.',
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/5.jpg',
      slug: 'RESIDENCE-003-SUNRISE-VISTARA',
      slugHex: 'UkVTSURFTkNFLTAwMy1TVU5SSVNFLVZJU1RBUkE'
    }
  ];

  constructor(
    private flipperFlagsService: FlipperFlagsService,
    private titleService: Title,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Home | SideA Architecture');
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.initInteractiveCanvas();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  getProjectRoute(project: FullpageProject): string[] {
    const isUrlBase64Enabled = this.flipperFlagsService.isEnabled('urlBase64');
    return ['/projects', isUrlBase64Enabled ? project.slugHex : project.slug];
  }

  scrollToSection(index: number): void {
    const sections = this.sectionRefs?.toArray();
    if (sections && sections[index]) {
      sections[index].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private setupIntersectionObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-section-index');
            if (indexAttr !== null) {
              this.activeSectionIndex = parseInt(indexAttr, 10);
            }
          }
        });
      },
      {
        threshold: 0.5
      }
    );

    this.sectionRefs?.forEach((section) => {
      this.observer?.observe(section.nativeElement);
    });
  }

  // --- Interactive Architectural Blueprint 3D Canvas ---
  private initInteractiveCanvas(): void {
    if (!this.canvasRef?.nativeElement) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.initMeshes();
    this.initParticles();

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.targetRotY = x * 0.8;
      this.targetRotX = -y * 0.8;
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    this.ngZone.runOutsideAngular(() => {
      let time = 0;
      const render = () => {
        time += 0.01;
        this.currentRotX += (this.targetRotX - this.currentRotX) * 0.05;
        this.currentRotY += (this.targetRotY - this.currentRotY) * 0.05;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background subtle grid
        this.drawArchitecturalGrid(ctx, canvas.width, canvas.height, time);

        // 3D Wireframe Architectural Structures
        this.drawWireframeMeshes(ctx, canvas.width, canvas.height, time);

        // Floating blueprint coordinate nodes
        this.drawParticles(ctx, canvas.width, canvas.height);

        this.animFrameId = requestAnimationFrame(render);
      };

      this.animFrameId = requestAnimationFrame(render);
    });
  }

  private initMeshes(): void {
    // 1. Primary Tower / Cantilevered Structure
    const tower: WireframeMesh = {
      center: { x: 180, y: 0, z: 0 },
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      vertices: [
        // Base Box
        { x: -100, y: -160, z: -80 },
        { x: 100, y: -160, z: -80 },
        { x: 100, y: 160, z: -80 },
        { x: -100, y: 160, z: -80 },
        { x: -100, y: -160, z: 80 },
        { x: 100, y: -160, z: 80 },
        { x: 100, y: 160, z: 80 },
        { x: -100, y: 160, z: 80 },
        // Cantilever Upper Slab
        { x: -160, y: -80, z: 140 },
        { x: 160, y: -80, z: 140 },
        { x: 160, y: -40, z: 140 },
        { x: -160, y: -40, z: 140 },
        { x: -160, y: -80, z: -20 },
        { x: 160, y: -80, z: -20 },
        { x: 160, y: -40, z: -20 },
        { x: -160, y: -40, z: -20 }
      ],
      edges: [
        // Box edges
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        // Cantilever edges
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
        // Connecting supports
        [2, 10], [3, 11], [6, 14], [7, 15]
      ]
    };

    // 2. Secondary Floating Polyhedron Pavilion
    const pavilion: WireframeMesh = {
      center: { x: -220, y: 40, z: 50 },
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      vertices: [
        { x: -80, y: -80, z: -80 },
        { x: 80, y: -80, z: -80 },
        { x: 80, y: 80, z: -80 },
        { x: -80, y: 80, z: -80 },
        { x: 0, y: -130, z: 0 },
        { x: 0, y: 130, z: 0 }
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [0, 4], [1, 4], [2, 4], [3, 4],
        [0, 5], [1, 5], [2, 5], [3, 5]
      ]
    };

    this.meshes = [tower, pavilion];
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }
  }

  private drawArchitecturalGrid(ctx: CanvasRenderingContext2D, width: number, height: number, time: number): void {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;

    const gridSize = 60;
    const offsetX = (time * 10) % gridSize;
    const offsetY = (time * 10) % gridSize;

    ctx.beginPath();
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Subtle radial light around cursor
    if (this.mouseX && this.mouseY) {
      const grad = ctx.createRadialGradient(this.mouseX, this.mouseY, 10, this.mouseX, this.mouseY, 320);
      grad.addColorStop(0, 'rgba(100, 180, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  private drawWireframeMeshes(ctx: CanvasRenderingContext2D, width: number, height: number, time: number): void {
    const cx = width / 2;
    const cy = height / 2;
    const fov = 450;

    this.meshes.forEach((mesh, index) => {
      const autoRotY = time * 0.15 * (index === 0 ? 1 : -1);
      const autoRotX = Math.sin(time * 0.2) * 0.1;

      const totalRotX = this.currentRotX + autoRotX;
      const totalRotY = this.currentRotY + autoRotY;

      // Project vertices to 2D
      const projected: { x: number; y: number; z: number }[] = mesh.vertices.map((v) => {
        // Offset by mesh center
        let x = v.x + mesh.center.x;
        let y = v.y + mesh.center.y;
        let z = v.z + mesh.center.z;

        // Rotate Y
        const cosY = Math.cos(totalRotY);
        const sinY = Math.sin(totalRotY);
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate X
        const cosX = Math.cos(totalRotX);
        const sinX = Math.sin(totalRotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Perspective scale
        const scale = fov / (fov + z2 + 200);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2
        };
      });

      // Draw Edges
      ctx.lineWidth = 1.2;
      mesh.edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.65, 0.45 - avgZ / 800));

        ctx.strokeStyle = `rgba(220, 235, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Vertex Nodes
      projected.forEach((p) => {
        const nodeAlpha = Math.max(0.2, Math.min(0.85, 0.6 - p.z / 600));
        ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  private drawParticles(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const cx = width / 2;
    const cy = height / 2;

    this.particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -400) p.x = 400;
      if (p.x > 400) p.x = -400;
      if (p.y < -300) p.y = 300;
      if (p.y > 300) p.y = -300;

      const px = cx + p.x + this.currentRotY * 120;
      const py = cy + p.y + this.currentRotX * 120;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  isNewDashBoardEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('newDashboard');
  }
}
