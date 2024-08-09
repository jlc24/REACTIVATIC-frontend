import { TestBed } from '@angular/core/testing';

import { EnlacesrolesService } from './enlacesroles.service';

describe('EnlacesrolesService', () => {
  let service: EnlacesrolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnlacesrolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
