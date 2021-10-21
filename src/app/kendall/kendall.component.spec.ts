import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KendallComponent } from './kendall.component';

describe('KendallComponent', () => {
  let component: KendallComponent;
  let fixture: ComponentFixture<KendallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KendallComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KendallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
