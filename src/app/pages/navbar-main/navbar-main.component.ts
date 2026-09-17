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

  onLogoClick(event: MouseEvent): void {
    this.closeNavbar();
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']).then(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  onHomeClick(event: MouseEvent): void {
    this.closeNavbar();
    if (this.router.url === '/' || this.router.url.startsWith('/#')) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
