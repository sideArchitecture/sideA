import { Component, OnInit } from '@angular/core';
// people.component.ts (inside ngAfterViewInit)
import { gsap } from 'gsap';
@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



ngAfterViewInit() {
  gsap.from('.principal-profile', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power2.out'
  });
}

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      console.log('Email copied to clipboard:', email);
      // Optionally show a toast or alert
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  }

}
