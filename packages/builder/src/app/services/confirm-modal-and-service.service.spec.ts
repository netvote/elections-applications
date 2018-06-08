import { TestBed, inject } from '@angular/core/testing';

import { ConfirmModalAndServiceService } from './confirm-modal-and-service.service';

describe('ConfirmModalAndServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmModalAndServiceService]
    });
  });

  it('should be created', inject([ConfirmModalAndServiceService], (service: ConfirmModalAndServiceService) => {
    expect(service).toBeTruthy();
  }));
});
