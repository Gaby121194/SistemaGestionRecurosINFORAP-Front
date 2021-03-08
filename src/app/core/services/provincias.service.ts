import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { Provincia } from '../models/Provincia';

@Injectable({
  providedIn: 'root'
})
export class ProvinciasService extends BaseService {

  public list(): Observable<Provincia[]> {
    return this.httpClient.get<Provincia[]>(`${this.APIEndpoint}provincias`);
  }
  public getBy(id): Observable<Provincia> {
    return this.httpClient.get<Provincia>(`${this.APIEndpoint}provincias/${id}`);
  }
}