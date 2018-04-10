import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotGroupComponent } from './ballot-group.component';

describe('BallotGroupComponent', () => {
  let component: BallotGroupComponent;
  let fixture: ComponentFixture<BallotGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
