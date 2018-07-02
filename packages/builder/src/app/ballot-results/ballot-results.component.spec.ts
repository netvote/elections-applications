import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotResultsComponent } from './ballot-results.component';

describe('BallotResultsComponent', () => {
  let component: BallotResultsComponent;
  let fixture: ComponentFixture<BallotResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
