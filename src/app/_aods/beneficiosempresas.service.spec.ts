import { TestBed } from '@angular/core/testing';

import { BeneficiosempresasService } from './beneficiosempresas.service';

describe('BeneficiosempresasService', () => {
  let service: BeneficiosempresasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiosempresasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
