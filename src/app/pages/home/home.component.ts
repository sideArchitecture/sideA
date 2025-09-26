import { Component, OnInit } from '@angular/core';
import {FlipperFlagsService} from "../../services/flipper-flags.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isImageLoaded = false;

  constructor(private featureFlags: FlipperFlagsService) { }

  ngOnInit(): void {
  }

  isNewDashBoardEnabled(){
   return  this.featureFlags.isEnabled('newDashboard');
  }

}
