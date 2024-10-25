import { TestBed } from '@angular/core/testing';

import { AsistenciasempresasService } from './asistenciasempresas.service';

describe('AsistenciasempresasService', () => {
  let service: AsistenciasempresasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsistenciasempresasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
