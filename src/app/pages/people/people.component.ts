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



  ngAfterViewInit(): void {
    gsap.from('.project-profile', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power2.out'
    });

    gsap.from('.project-image', {
      opacity: 0,
      scale: 0.95,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.5
    });
  }




  copied: boolean = false;

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      this.copied = true;

      // Hide message after 2 seconds
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy email:', err);
    });
  }

}
