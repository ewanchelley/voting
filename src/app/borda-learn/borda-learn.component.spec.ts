import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordaLearnComponent } from './borda-learn.component';

describe('BordaLearnComponent', () => {
  let component: BordaLearnComponent;
  let fixture: ComponentFixture<BordaLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BordaLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BordaLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
