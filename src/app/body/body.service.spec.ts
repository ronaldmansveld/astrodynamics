import { TestBed } from '@angular/core/testing';

import { BodyService } from './body.service';

describe('BodyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BodyService = TestBed.get(BodyService);
    expect(service).toBeTruthy();
  });
});
