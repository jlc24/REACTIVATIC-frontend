import { TestBed } from '@angular/core/testing';

import { TiposbeneficiosService } from './tiposbeneficios.service';

describe('TiposbeneficiosService', () => {
  let service: TiposbeneficiosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposbeneficiosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
