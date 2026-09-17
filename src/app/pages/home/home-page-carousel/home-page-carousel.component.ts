import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlipperFlagsService } from '../../../services/flipper-flags.service';

export interface CarouselSlide {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  client?: string;
  designStyle?: string;
  builtStatus?: string;
  description?: string;
  slug: string;
  slugHex: string;
}

@Component({
  selector: 'app-home-page-carousel',
  templateUrl: './home-page-carousel.component.html',
  styleUrls: ['./home-page-carousel.component.scss']
})
export class HomePageCarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carouselRef', { static: false }) carouselRef?: ElementRef<HTMLDivElement>;

  slides: CarouselSlide[] = [
    {
      id: 1,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/1.jpg',
      title: 'Adali Cultural Center',
      category: 'Institutional & Hospitality',
      location: 'Palakonda, AP',
      year: '2018',
      client: 'Govt. of Andhra Pradesh',
      designStyle: 'Contemporary Chalet',
      builtStatus: 'Unbuilt',
      description: 'Chalet-inspired cultural sanctuary crafted for the Government of Andhra Pradesh in Palakonda.',
      slug: 'HOSPITALITY-001-ADALI-RESORT',
      slugHex: 'SE9TUElUQUxJVFktMDAxLUFEQUxJLVJFU09SVA'
    },
    {
      id: 2,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/2.jpg',
      title: 'Girijana Commercial Complex',
      category: 'Commercial Architecture',
      location: 'Palakonda, AP',
      year: '2019',
      client: 'Govt. of Andhra Pradesh',
      designStyle: 'Contemporary',
      builtStatus: 'Built',
      description: 'Contemporary commercial hub and community marketplace for the Govt. of Andhra Pradesh.',
      slug: 'COMMERCIAL-001-GCC',
      slugHex: 'Q09NTUVSQ0lBTC0wMDEtR0ND'
    },
    {
      id: 3,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/3.jpg',
      title: 'Memorial Ghat',
      category: 'Monument & Public Space',
      location: 'Kadapa, AP',
      year: '2022',
      designStyle: 'Neo Classical',
      builtStatus: 'Unbuilt',
      description: 'Neo-classical riverside monumental landscape and serene civic reflection space.',
      slug: 'MORE-001-MEMORIAL-DESIGN',
      slugHex: 'TU9SRS0wMDEtTUVNT1JJQUwtREVTSUdO'
    },
    {
      id: 4,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/4.jpg',
      title: 'TUDA Conference Hall',
      category: 'Civic & Office Interiors',
      location: 'Tirupati, AP',
      year: '2018',
      designStyle: 'Modern',
      builtStatus: 'Built',
      description: 'Modern administrative conference hall and civic interior design for Tirupati Urban Development Authority.',
      slug: 'OFFICE-002-TUDA-CONFERENCE',
      slugHex: 'T0ZGSUNFLTAwMi1UVURBLUNPTkZFUkVOQ0U'
    },
    {
      id: 5,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/5.jpg',
      title: 'Sunrise Vistara',
      category: 'Residential Architecture',
      location: 'Visakhapatnam, AP',
      year: '2023',
      designStyle: 'Contemporary',
      builtStatus: 'Built',
      description: 'Contemporary multi-residential living emphasizing natural daylight and coastal cross-ventilation.',
      slug: 'RESIDENCE-003-SUNRISE-VISTARA',
      slugHex: 'UkVTSURFTkNFLTAwMy1TVU5SSVNFLVZJU1RBUkE'
    }
  ];

  activeIndex = 0;
  private touchStartX = 0;
  private touchEndX = 0;
  private carouselListener?: (e: any) => void;

  constructor(
    private router: Router,
    private flipperFlagsService: FlipperFlagsService
  ) { }

  ngOnInit(): void {
  }

  getProjectRoute(slide: CarouselSlide): string[] {
    const isUrlBase64Enabled = this.flipperFlagsService.isEnabled('urlBase64');
    return ['/projects', isUrlBase64Enabled ? slide.slugHex : slide.slug];
  }

  navigateToProject(slide: CarouselSlide): void {
    this.router.navigate(this.getProjectRoute(slide), {
      queryParams: { category: 'All' }
    });
  }

  ngAfterViewInit(): void {
    if (this.carouselRef?.nativeElement) {
      const el = this.carouselRef.nativeElement;
      this.carouselListener = (e: any) => {
        if (e.to !== undefined) {
          this.activeIndex = e.to;
        }
      };
      el.addEventListener('slid.bs.carousel', this.carouselListener);
    }
  }

  ngOnDestroy(): void {
    if (this.carouselRef?.nativeElement && this.carouselListener) {
      this.carouselRef.nativeElement.removeEventListener('slid.bs.carousel', this.carouselListener);
    }
  }

  onTouchStart(e: TouchEvent): void {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  onTouchEnd(e: TouchEvent): void {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipeGesture();
  }

  private handleSwipeGesture(): void {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const threshold = 50;

    if (Math.abs(swipeDistance) > threshold) {
      const carouselInstance = (window as any).bootstrap?.Carousel?.getInstance(this.carouselRef?.nativeElement);
      if (carouselInstance) {
        if (swipeDistance < 0) {
          carouselInstance.next();
        } else {
          carouselInstance.prev();
        }
      }
    }
  }
}
