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
import { ActivatedRoute, Router } from '@angular/router';
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
  scale?: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('blueprintCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;
  @ViewChild('closingCanvas', { static: false }) closingCanvasRef?: ElementRef<HTMLCanvasElement>;

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
  private closingParticles: { x: number; y: number; z: number; vx: number; vy: number }[] = [];

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
    private route: ActivatedRoute,
    private flipperFlagsService: FlipperFlagsService,
    private titleService: Title,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Home | SideA Architecture');

    // Handle return navigation (via on-page Back button or browser Back button)
    this.route.queryParamMap.subscribe((params) => {
      const sectionParam = params.get('section');
      const storedSection = sessionStorage.getItem('navigated_from_home_section');

      let targetIndex: number | null = null;
      if (sectionParam !== null && sectionParam !== undefined) {
        targetIndex = parseInt(sectionParam, 10);
      } else if (storedSection !== null) {
        targetIndex = parseInt(storedSection, 10);
      }

      if (targetIndex !== null && !isNaN(targetIndex)) {
        sessionStorage.removeItem('navigated_from_home_section');
        setTimeout(() => {
          this.scrollToSection(targetIndex!);
        }, 180);
      }
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    this.initInteractiveCanvases();

    // Secondary check in case view elements initialize after route subscription
    const storedSection = sessionStorage.getItem('navigated_from_home_section');
    if (storedSection !== null) {
      const targetIndex = parseInt(storedSection, 10);
      if (!isNaN(targetIndex)) {
        sessionStorage.removeItem('navigated_from_home_section');
        setTimeout(() => {
          this.scrollToSection(targetIndex);
        }, 220);
      }
    }
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

  onProjectClick(sectionIndex: number): void {
    // Record current section in sessionStorage so browser Back button also returns to this slide
    sessionStorage.setItem('navigated_from_home_section', String(sectionIndex));
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
              // Track current active section for session persistence
              sessionStorage.setItem('home_last_active_section', String(this.activeSectionIndex));
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

  // --- Interactive Architectural 3D Canvases ---
  private initInteractiveCanvases(): void {
    this.initMeshes();
    this.initParticles();

    const canvas1 = this.canvasRef?.nativeElement;
    const canvas2 = this.closingCanvasRef?.nativeElement;

    const resizeCanvases = () => {
      if (canvas1) {
        canvas1.width = canvas1.parentElement?.clientWidth || window.innerWidth;
        canvas1.height = canvas1.parentElement?.clientHeight || window.innerHeight;
      }
      if (canvas2) {
        canvas2.width = canvas2.parentElement?.clientWidth || window.innerWidth;
        canvas2.height = canvas2.parentElement?.clientHeight || window.innerHeight;
      }
    };

    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // Mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      this.targetRotY = x * 0.85;
      this.targetRotX = -y * 0.85;
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    this.ngZone.runOutsideAngular(() => {
      let time = 0;
      const render = () => {
        time += 0.01;
        this.currentRotX += (this.targetRotX - this.currentRotX) * 0.05;
        this.currentRotY += (this.targetRotY - this.currentRotY) * 0.05;

        // Render Canvas 1 (Hero: Blueprint Grid + Offset Side 3D Wireframe Lines + Mouse Tracking)
        if (canvas1) {
          const ctx1 = canvas1.getContext('2d');
          if (ctx1) {
            ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
            this.drawArchitecturalGrid(ctx1, canvas1.width, canvas1.height, time);
            this.drawWireframeMeshes(ctx1, this.meshes, canvas1.width, canvas1.height, time);
            this.drawParticles(ctx1, this.particles, canvas1.width, canvas1.height);
          }
        }

        // Render Canvas 2 (Closing: Mouse Animation with Floating Coordinate Particles & Ambient Cursor Light only)
        if (canvas2) {
          const ctx2 = canvas2.getContext('2d');
          if (ctx2) {
            ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
            this.drawCursorAura(ctx2, canvas2.width, canvas2.height);
            this.drawParticles(ctx2, this.closingParticles, canvas2.width, canvas2.height);
          }
        }

        this.animFrameId = requestAnimationFrame(render);
      };

      this.animFrameId = requestAnimationFrame(render);
    });
  }

  private initMeshes(): void {
    const tower: WireframeMesh = {
      center: { x: 420, y: -20, z: 0 },
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      vertices: [
        { x: -90, y: -150, z: -70 },
        { x: 90, y: -150, z: -70 },
        { x: 90, y: 150, z: -70 },
        { x: -90, y: 150, z: -70 },
        { x: -90, y: -150, z: 70 },
        { x: 90, y: -150, z: 70 },
        { x: 90, y: 150, z: 70 },
        { x: -90, y: 150, z: 70 },
        { x: -140, y: -70, z: 120 },
        { x: 140, y: -70, z: 120 },
        { x: 140, y: -30, z: 120 },
        { x: -140, y: -30, z: 120 },
        { x: -140, y: -70, z: -20 },
        { x: 140, y: -70, z: -20 },
        { x: 140, y: -30, z: -20 },
        { x: -140, y: -30, z: -20 }
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
        [2, 10], [3, 11], [6, 14], [7, 15]
      ]
    };

    const pavilion: WireframeMesh = {
      center: { x: -440, y: -130, z: 30 },
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      vertices: [
        { x: -75, y: -75, z: -75 },
        { x: 75, y: -75, z: -75 },
        { x: 75, y: 75, z: -75 },
        { x: -75, y: 75, z: -75 },
        { x: 0, y: -120, z: 0 },
        { x: 0, y: 120, z: 0 }
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
    this.closingParticles = [];
    for (let i = 0; i < 45; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 850,
        y: (Math.random() - 0.5) * 650,
        z: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
      this.closingParticles.push({
        x: (Math.random() - 0.5) * 850,
        y: (Math.random() - 0.5) * 650,
        z: (Math.random() - 0.5) * 400,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      });
    }
  }

  private drawArchitecturalGrid(ctx: CanvasRenderingContext2D, width: number, height: number, time: number): void {
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.04)';
    ctx.lineWidth = 1;

    const gridSize = 60;
    const offsetX = (time * 8) % gridSize;
    const offsetY = (time * 8) % gridSize;

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

    this.drawCursorAura(ctx, width, height);
  }

  private drawCursorAura(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.mouseX && this.mouseY) {
      const grad = ctx.createRadialGradient(this.mouseX, this.mouseY, 10, this.mouseX, this.mouseY, 280);
      grad.addColorStop(0, 'rgba(30, 64, 175, 0.045)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
  }

  private drawWireframeMeshes(
    ctx: CanvasRenderingContext2D,
    meshes: WireframeMesh[],
    width: number,
    height: number,
    time: number
  ): void {
    const cx = width / 2;
    const cy = height / 2;
    const fov = 450;
    const sideOffset = Math.max(340, width * 0.34);

    meshes.forEach((mesh, index) => {
      const autoRotY = time * 0.15 * (index === 0 ? 1 : -1);
      const autoRotX = Math.sin(time * 0.2) * 0.1;

      const totalRotX = this.currentRotX + autoRotX;
      const totalRotY = this.currentRotY + autoRotY;

      const posX = index === 0 ? sideOffset : -sideOffset;
      const posY = index === 0 ? -20 : -140;

      const projected: { x: number; y: number; z: number }[] = mesh.vertices.map((v) => {
        let x = v.x + posX;
        let y = v.y + posY;
        let z = v.z + mesh.center.z;

        const cosY = Math.cos(totalRotY);
        const sinY = Math.sin(totalRotY);
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        const cosX = Math.cos(totalRotX);
        const sinX = Math.sin(totalRotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        const scale = fov / (fov + z2 + 200);
        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          z: z2
        };
      });

      ctx.lineWidth = 1.2;
      mesh.edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        if (!p1 || !p2) return;

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.18, Math.min(0.7, 0.45 - avgZ / 800));

        ctx.strokeStyle = `rgba(30, 41, 59, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      projected.forEach((p) => {
        const nodeAlpha = Math.max(0.25, Math.min(0.85, 0.65 - p.z / 600));
        ctx.fillStyle = `rgba(15, 23, 42, ${nodeAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  private drawParticles(
    ctx: CanvasRenderingContext2D,
    particles: { x: number; y: number; z: number; vx: number; vy: number }[],
    width: number,
    height: number
  ): void {
    const cx = width / 2;
    const cy = height / 2;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -450) p.x = 450;
      if (p.x > 450) p.x = -450;
      if (p.y < -350) p.y = 350;
      if (p.y > 350) p.y = -350;

      const px = cx + p.x + this.currentRotY * 130;
      const py = cy + p.y + this.currentRotX * 130;

      ctx.fillStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.beginPath();
      ctx.arc(px, py, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  isNewDashBoardEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('newDashboard');
  }
}
