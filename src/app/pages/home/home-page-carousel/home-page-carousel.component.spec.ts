import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageCarouselComponent } from './home-page-carousel.component';

describe('HomePageCarouselComponent', () => {
  let component: HomePageCarouselComponent;
  let fixture: ComponentFixture<HomePageCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomePageCarouselComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
