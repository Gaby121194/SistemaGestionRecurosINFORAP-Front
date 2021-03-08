import { Injectable } from '@angular/core';
import { Estado } from '../models/estado';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoService extends BaseService{
  

  public list(): Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(`${this.APIEndpoint}estados`);
  }
  public create(estado) : Observable<Estado>  {
    return this.httpClient.post<Estado>
    (`${this.APIEndpoint}estados`,estado);      
}

public getBy(id): Observable<Estado> {
  return this.httpClient.get<Estado>(`${this.APIEndpoint}estados/${id}`);
}
public update(id,tipoRecurso): Observable<Estado> {
  return this.httpClient.put<Estado>(`${this.APIEndpoint}estados/${id}`,tipoRecurso);
}

public delete(id) : Observable<Estado> {

return this.httpClient.delete<Estado>(`${this.APIEndpoint}estados/${id}`)    
}

}
