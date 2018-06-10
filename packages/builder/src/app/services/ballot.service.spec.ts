import { TestBed, inject } from '@angular/core/testing';

import { BallotService } from './ballot.service';

describe('BallotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BallotService]
    });
  });

  it('should be created', inject([BallotService], (service: BallotService) => {
    expect(service).toBeTruthy();
  }));
});
