import { TestBed } from '@angular/core/testing';

import { TamanosService } from './tamanos.service';

describe('TamanosService', () => {
  let service: TamanosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TamanosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
