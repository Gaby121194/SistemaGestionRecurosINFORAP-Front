import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Requisito } from '../models/requisito';

@Injectable({
  providedIn: 'root'
})
export class RequisitosService extends BaseService {
  constructor(httpClient: HttpClient) { super(httpClient) }

  public list(idServicio): Observable<Requisito[]> {
    return this.httpClient.get<Requisito[]>(`${this.APIEndpoint}requisitos/servicios/${idServicio}`)
  }
  public create(idServicio, requisito): Observable<Requisito> {
    return this.httpClient.post<Requisito>(`${this.APIEndpoint}requisitos/servicios/${idServicio}`, requisito)
  }
  public delete(idRequisito) {
    return this.httpClient.delete(`${this.APIEndpoint}requisitos/${idRequisito}`)
  }
}
