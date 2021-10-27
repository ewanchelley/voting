import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingOffcanvasComponent } from './ranking-offcanvas.component';

describe('RankingOffcanvasComponent', () => {
  let component: RankingOffcanvasComponent;
  let fixture: ComponentFixture<RankingOffcanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingOffcanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RankingOffcanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
