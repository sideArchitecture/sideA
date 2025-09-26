import { Component, OnInit } from '@angular/core';
import {FlipperFlagsService} from "../../services/flipper-flags.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isImageLoaded = false;

  constructor(private flipperFlagsService: FlipperFlagsService) { }

  ngOnInit(): void {
  }

  isNewDashBoardEnabled(){
   return  this.flipperFlagsService.isEnabled('newDashboard');
  }

}
