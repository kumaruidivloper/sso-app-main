import { TestBed } from '@angular/core/testing';

import { SSOService } from './sso-service';

describe('SSOService', () => {
  let service: SSOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SSOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
