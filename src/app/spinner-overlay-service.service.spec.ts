import { TestBed } from '@angular/core/testing';

import { SpinnerOverlayServiceService } from './spinner-overlay-service.service';

describe('SpinnerOverlayServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpinnerOverlayServiceService = TestBed.get(SpinnerOverlayServiceService);
    expect(service).toBeTruthy();
  });
});
