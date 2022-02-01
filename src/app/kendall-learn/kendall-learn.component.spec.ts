import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KendallLearnComponent } from './kendall-learn.component';

describe('KendallLearnComponent', () => {
  let component: KendallLearnComponent;
  let fixture: ComponentFixture<KendallLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KendallLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KendallLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
