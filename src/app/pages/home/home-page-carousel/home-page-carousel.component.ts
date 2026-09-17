import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

export interface CarouselSlide {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
  location?: string;
  year?: string;
  description?: string;
  projectSlug?: string;
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
      title: 'White Modern Minimal Residence',
      category: 'Residential Architecture',
      location: 'Pune, India',
      year: '2024',
      description: 'Clean geometric lines, monolithic white facades, and expansive natural daylight integration.',
      projectSlug: 'white-modern-minimal-residence'
    },
    {
      id: 2,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/2.jpg',
      title: 'Memorial Ghat Sanctuary',
      category: 'Public & Cultural Space',
      location: 'Maharashtra, India',
      year: '2023',
      description: 'Serene public architecture blending native landscape, spiritual reflection, and local stone craftsmanship.',
      projectSlug: 'memorial-ghat'
    },
    {
      id: 3,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/3.jpg',
      title: 'Sunrise Vistara',
      category: 'Contemporary Housing',
      location: 'Pune, India',
      year: '2023',
      description: 'Harmonious multi-dwelling layout designed with cross-ventilation and elevated green terraces.',
      projectSlug: 'sunrise-vistara'
    },
    {
      id: 4,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/4.jpg',
      title: 'Monochrome Living Concepts',
      category: 'Interior & Form Design',
      location: 'Pune, India',
      year: '2024',
      description: 'Minimal material palettes, custom spatial volumes, and seamless indoor-outdoor connectivity.',
      projectSlug: 'monochrome-living'
    },
    {
      id: 5,
      imageUrl: 'assets/images/home_page_carousel/sidea_photos2/5.jpg',
      title: 'Studio Pavilion & Courtyards',
      category: 'Commercial & Institutional',
      location: 'Pune, India',
      year: '2024',
      description: 'Dynamic workspace architecture celebrating raw textures, courtyard biophilia, and climatic shading.',
      projectSlug: 'studio-pavilion'
    }
  ];

  activeIndex = 0;
  private touchStartX = 0;
  private touchEndX = 0;
  private carouselListener?: (e: any) => void;

  constructor() { }

  ngOnInit(): void {
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
