import { Component, OnInit } from '@angular/core';
import {gsap} from "gsap";
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor( private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('About | SideA Architecture');

  }


  ngAfterViewInit() {
    gsap.from('.firm-profile', {
      opacity: 0,
      y: 50,
      duration: 2,
      ease: 'power2.out'
    });

    gsap.from('.principal-profile', {
      opacity: 0,
      y: 50,
      duration: 5,
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
