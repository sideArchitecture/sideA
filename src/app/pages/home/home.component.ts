import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('sectionRef') sectionRefs!: QueryList<ElementRef<HTMLElement>>;

  activeSectionIndex = 0;
  private observer?: IntersectionObserver;

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Home | SideA Architecture');
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
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

  isNewDashBoardEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('newDashboard');
  }
}
