import { TestBed } from '@angular/core/testing';

import { TipoReglaService } from './tipo-regla.service';

describe('TipoReglaService', () => {
  let service: TipoReglaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoReglaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
