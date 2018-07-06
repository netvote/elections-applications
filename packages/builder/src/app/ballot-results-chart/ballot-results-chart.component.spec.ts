import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotResultsChartComponent } from './ballot-results-chart.component';

describe('BallotResultsChartComponent', () => {
  let component: BallotResultsChartComponent;
  let fixture: ComponentFixture<BallotResultsChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotResultsChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotResultsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
