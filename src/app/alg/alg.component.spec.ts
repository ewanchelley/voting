import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgComponent } from './alg.component';

describe('AlgComponent', () => {
  let component: AlgComponent;
  let fixture: ComponentFixture<AlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
