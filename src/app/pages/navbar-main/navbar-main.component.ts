import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent {

  constructor(public router: Router) {}

  toggleNavbar(): void {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
      navbarCollapse.classList.toggle('show');
    }
  }

  closeNavbar(): void {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
      navbarCollapse.classList.remove('show');
    }
  }

  private scrollToTop(): void {
    // 1. Scroll window and document elements
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Scroll full-page snap containers if active
    const fullpageHome = document.querySelector('.fullpage-experience-container');
    if (fullpageHome) {
      fullpageHome.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const fullpageAbout = document.querySelector('.about-fullpage-container');
    if (fullpageAbout) {
      fullpageAbout.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Fallback scrollIntoView on first section if present
    const firstSection = document.querySelector('.fullscreen-project-section, .about-snap-section');
    if (firstSection) {
      firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onLogoClick(event: MouseEvent): void {
    this.closeNavbar();
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      this.scrollToTop();
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToTop(), 60);
      });
    }
  }

  onHomeClick(event: MouseEvent): void {
    this.closeNavbar();
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      this.scrollToTop();
    }
  }
}
