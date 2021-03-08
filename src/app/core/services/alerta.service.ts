import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertaServicio } from '../models/alerta-servicio';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AlertaService extends BaseService{
  public list(): Observable<AlertaServicio[]> {   
    return this.httpClient.get<AlertaServicio[]>(`${this.APIEndpoint}alertas/servicios`);
  }
  public count(): Observable<any> {   
    return this.httpClient.get<any>(`${this.APIEndpoint}alertas`);
  }
  
}
