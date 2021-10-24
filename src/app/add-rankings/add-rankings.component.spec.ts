import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRankingsComponent } from './add-rankings.component';

describe('AddRankingsComponent', () => {
  let component: AddRankingsComponent;
  let fixture: ComponentFixture<AddRankingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRankingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
