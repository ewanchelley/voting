import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KemenyLearnComponent } from './kemeny-learn.component';

describe('KemenyLearnComponent', () => {
  let component: KemenyLearnComponent;
  let fixture: ComponentFixture<KemenyLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KemenyLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KemenyLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
