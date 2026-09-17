import { Component, OnInit, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { Title } from '@angular/platform-browser';
import { FlipperFlagsService } from '../../services/flipper-flags.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit {
  copiedEmail = false;
  copiedPhone = false;

  constructor(
    private titleService: Title,
    private flipperFlagsService: FlipperFlagsService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('About | SideA Architecture');
  }

  ngAfterViewInit(): void {
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
