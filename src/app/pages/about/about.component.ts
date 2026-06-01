import { Component, OnInit } from '@angular/core';
import {gsap} from "gsap";
import { Title } from '@angular/platform-browser';
import {FlipperFlagsService} from "../../services/flipper-flags.service";


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor( private titleService: Title,
               private flipperFlagsService: FlipperFlagsService,

               ) { }

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

  isProfilePhotoUpdateEnabled(): boolean {
    return this.flipperFlagsService.isEnabled('profilePhotoUpdate');
  }

  profilePhotoUrl(){
    var profilePhotoUpdateEnabled = this.flipperFlagsService.isEnabled('profilePhotoUpdate');
    if(profilePhotoUpdateEnabled){
      return "../../../assets/images/people/principal-architect.jpg"
    }else{
      return "../../../assets/images/people/principal-architect3.jpg"
    }
  }



  copiedEmail: boolean = false;
  copiedPhone: boolean = false;

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      if (email.includes('@')) {
        this.copiedEmail = true;
        setTimeout(() => this.copiedEmail = false, 2000);
      } else {
        this.copiedPhone = true;
        setTimeout(() => this.copiedPhone = false, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }


}
