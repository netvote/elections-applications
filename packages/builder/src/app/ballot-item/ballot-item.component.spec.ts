import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotItemComponent } from './ballot-item.component';

describe('BallotItemComponent', () => {
  let component: BallotItemComponent;
  let fixture: ComponentFixture<BallotItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
