import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Permiso } from '../models/permiso';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PermisosService extends BaseService {
  constructor(private datePipe: DatePipe, protected httpClient: HttpClient) {
    super(httpClient)
  }

  public list(): Observable<Permiso[]> {
    return this.httpClient.get<Permiso[]>(`${this.APIEndpoint}Permisos`);
  }

  public listBy(filter): Observable<Permiso[]> {
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<Permiso[]>(`${this.APIEndpoint}permisos`, { params: params });
  }
  public getBy(id): Observable<Permiso> {
    return this.httpClient.get<Permiso>(`${this.APIEndpoint}permisos/${id}`);
  }

  public create(permiso): Observable<Permiso> {
    return this.httpClient.post<Permiso>(`${this.APIEndpoint}permisos`, permiso);
  }
  public update(id, permiso): Observable<Permiso> {
    return this.httpClient.put<Permiso>(`${this.APIEndpoint}permisos/${id}`, permiso);
  }
  public disable(id)  {
    return this.httpClient.delete(`${this.APIEndpoint}permisos/${id}`); 
  }
  public enable(id) {
    return this.httpClient.patch(`${this.APIEndpoint}permisos/${id}`,{});
  }

  public validateFields( value, id = ""): Observable<any> {
    let params = new HttpParams()
      .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}permisos/attributes/${value}`, { params: params });
  }
  private ParseDate(input: string) {
    if (!input || input.split("-").length != 3) return '';
    input = input.split("-")[2] + "/" + input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input, 'yyyy-MM-dd');
  }


}
