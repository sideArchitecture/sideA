import { Component, OnInit } from '@angular/core';
import {FeatureFlagsService} from "../../services/feature-flags.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isImageLoaded = false;

  constructor(private featureFlags: FeatureFlagsService) { }

  ngOnInit(): void {
  }

  isNewDashBoardEnabled(){
   return  this.featureFlags.isEnabled('newDashboard');
  }

}
