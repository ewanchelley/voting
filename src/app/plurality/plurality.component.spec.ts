import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PluralityComponent } from './plurality.component';

describe('PluralityComponent', () => {
  let component: PluralityComponent;
  let fixture: ComponentFixture<PluralityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PluralityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PluralityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
