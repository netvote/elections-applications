import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotSectionComponent } from './ballot-section.component';

describe('BallotSectionComponent', () => {
  let component: BallotSectionComponent;
  let fixture: ComponentFixture<BallotSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
