import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotListComponent } from './ballot-list.component';

describe('BallotListComponent', () => {
  let component: BallotListComponent;
  let fixture: ComponentFixture<BallotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
