import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BordaComponent } from './borda.component';

describe('BordaComponent', () => {
  let component: BordaComponent;
  let fixture: ComponentFixture<BordaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BordaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BordaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
