import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularLearnComponent } from './popular-learn.component';

describe('PopularLearnComponent', () => {
  let component: PopularLearnComponent;
  let fixture: ComponentFixture<PopularLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopularLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
