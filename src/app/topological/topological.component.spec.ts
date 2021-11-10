import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopologicalComponent } from './topological.component';

describe('TopologicalComponent', () => {
  let component: TopologicalComponent;
  let fixture: ComponentFixture<TopologicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopologicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopologicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
