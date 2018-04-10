import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotBuilderComponent } from './ballot-builder.component';

describe('BallotBuilderComponent', () => {
  let component: BallotBuilderComponent;
  let fixture: ComponentFixture<BallotBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BallotBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
