import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KemenyComponent } from './kemeny.component';

describe('KemenyComponent', () => {
  let component: KemenyComponent;
  let fixture: ComponentFixture<KemenyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KemenyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KemenyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
