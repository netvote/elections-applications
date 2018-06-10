import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotDatepickerComponent } from './ballot-datepicker.component';

describe('BallotDatepickerComponent', () => {
  let component: BallotDatepickerComponent;
  let fixture: ComponentFixture<BallotDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
