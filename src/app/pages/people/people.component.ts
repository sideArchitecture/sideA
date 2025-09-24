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
