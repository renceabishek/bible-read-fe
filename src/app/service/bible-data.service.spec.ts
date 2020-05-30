import { TestBed } from '@angular/core/testing';

import { BibleDataService } from './bible-data.service';

describe('BibleDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BibleDataService = TestBed.get(BibleDataService);
    expect(service).toBeTruthy();
  });
});
