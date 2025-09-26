import { NgModule } from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { NavbarMainComponent } from './pages/navbar-main/navbar-main.component';
import { FooterComponent } from './footer/footer.component';
import { HomePageCarouselComponent } from './pages/home/home-page-carousel/home-page-carousel.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { PeopleComponent } from './pages/people/people.component';
import { BuildingAnimationComponent } from './pages/building-animation/building-animation.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import {PinchZoomModule} from "@mtnair/ngx-pinch-zoom";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

import { APP_INITIALIZER } from '@angular/core';
import {FlipperFlagsService} from "./services/flipper-flags.service";
import {FlipperFlagDirective} from "./directives/flipper-flag.directive";
export function initFlags(flags: FlipperFlagsService) {
  return () => flags.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    NavbarMainComponent,
    FooterComponent,
    HomePageCarouselComponent,
    ProjectsComponent,
    PeopleComponent,
    BuildingAnimationComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    FlipperFlagDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HammerModule,
    PinchZoomModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initFlags,
      deps: [FlipperFlagsService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
