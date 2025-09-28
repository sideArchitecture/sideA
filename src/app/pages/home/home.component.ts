import { Component, OnInit } from '@angular/core';
import {FlipperFlagsService} from "../../services/flipper-flags.service";
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isImageLoaded = false;

  constructor(
    private flipperFlagsService: FlipperFlagsService,
    private titleService: Title

  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Home | SideA Architecture');
  }

  isNewDashBoardEnabled(){
   return  this.flipperFlagsService.isEnabled('newDashboard');
  }

}
