import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildBallotComponent } from './build-ballot.component';

describe('BuildBallotComponent', () => {
  let component: BuildBallotComponent;
  let fixture: ComponentFixture<BuildBallotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildBallotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildBallotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
