import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotModalComponent } from './ballot-modal.component';

describe('BallotModalComponent', () => {
  let component: BallotModalComponent;
  let fixture: ComponentFixture<BallotModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
