import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingAnimationComponent } from './building-animation.component';

describe('BuildingAnimationComponent', () => {
  let component: BuildingAnimationComponent;
  let fixture: ComponentFixture<BuildingAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuildingAnimationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
