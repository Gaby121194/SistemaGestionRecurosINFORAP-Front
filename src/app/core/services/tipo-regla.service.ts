import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { TipoRegla } from '../models/tipo-regla';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoReglaService extends BaseService {
  public list(): Observable<TipoRegla[]> {
    return this.httpClient.get<TipoRegla[]>(`${this.APIEndpoint}tiposreglas`);
  }
}
