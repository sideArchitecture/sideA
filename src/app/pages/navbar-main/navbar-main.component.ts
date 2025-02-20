import { Component, OnInit } from '@angular/core';

// Import Bootstrap
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-navbar-main',
  templateUrl: './navbar-main.component.html',
  styleUrls: ['./navbar-main.component.scss']
})
export class NavbarMainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  closeNavbar() {
    const navbar = document.getElementById('navbarNav');
    if (navbar) {
      const bsCollapse = new bootstrap.Collapse(navbar, {
        toggle: false
      });
      bsCollapse.hide();
    }
  }
}
