import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantRunoffLearnComponent } from './instant-runoff-learn.component';

describe('InstantRunoffLearnComponent', () => {
  let component: InstantRunoffLearnComponent;
  let fixture: ComponentFixture<InstantRunoffLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantRunoffLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantRunoffLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
