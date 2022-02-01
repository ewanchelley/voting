import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologicalLearnComponent } from './topological-learn.component';

describe('TopologicalLearnComponent', () => {
  let component: TopologicalLearnComponent;
  let fixture: ComponentFixture<TopologicalLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopologicalLearnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologicalLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
