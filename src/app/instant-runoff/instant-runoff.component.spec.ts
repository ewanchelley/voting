import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantRunoffComponent } from './instant-runoff.component';

describe('InstantRunoffComponent', () => {
  let component: InstantRunoffComponent;
  let fixture: ComponentFixture<InstantRunoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantRunoffComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantRunoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
