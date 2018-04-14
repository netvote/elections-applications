import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotAccordionComponent } from './ballot-accordion.component';

describe('BallotAccordionComponent', () => {
  let component: BallotAccordionComponent;
  let fixture: ComponentFixture<BallotAccordionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotAccordionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
