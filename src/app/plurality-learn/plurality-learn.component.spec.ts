import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluralityLearnComponent } from './plurality-learn.component';

describe('PluralityLearnComponent', () => {
  let component: PluralityLearnComponent;
  let fixture: ComponentFixture<PluralityLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluralityLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluralityLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
