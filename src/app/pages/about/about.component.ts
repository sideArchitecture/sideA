import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { gsap } from 'gsap';
import { Title } from '@angular/platform-browser';
import { FlipperFlagsService } from '../../services/flipper-flags.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  activeSectionIndex = 0;
  copiedEmail = false;
  copiedPhone = false;
  private observer?: IntersectionObserver;

  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private flipperFlagsService: FlipperFlagsService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('About | SideA Architecture');
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();

    gsap.from('.firm-profile', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.from('.pillar-card', {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.2,
      ease: 'power2.out'
    });

    gsap.from('.principal-profile', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.4,
      ease: 'power2.out'
    });

    // Handle scroll to fragment if present (e.g., #leadership or #contact)
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          const targetEl = document.getElementById(fragment);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
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

  isProfilePhotoUpdateEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('profilePhotoUpdate');
  }

  profilePhotoUrl(): string {
    const profilePhotoUpdateEnabled = this.flipperFlagsService.isEnabled('profilePhotoUpdate');
    if (profilePhotoUpdateEnabled) {
      return '../../../assets/images/people/principal-architect.jpg';
    } else {
      return '../../../assets/images/people/principal-architect3.jpg';
    }
  }

  copyEmail(contact: string): void {
    navigator.clipboard.writeText(contact).then(() => {
      if (contact.includes('@')) {
        this.copiedEmail = true;
        setTimeout(() => (this.copiedEmail = false), 2000);
      } else {
        this.copiedPhone = true;
        setTimeout(() => (this.copiedPhone = false), 2000);
      }
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  }

  isClientsListDisplayEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('displayClientList');
  }
}
