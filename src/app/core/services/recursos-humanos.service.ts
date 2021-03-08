import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { RecursoHumano, recursoHumanoFilter } from '../models/recurso-humano';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecursosHumanosService extends BaseService {

  constructor(private datePipe: DatePipe, protected httpClient: HttpClient) {
    super(httpClient)
  }
  public listBy(filter: recursoHumanoFilter): Observable<RecursoHumano[]> {
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<RecursoHumano[]>(`${this.APIEndpoint}recursoshumanos`, { params: params })
  }

  public list(): Observable<RecursoHumano[]> {
    return this.httpClient.get<RecursoHumano[]>(`${this.APIEndpoint}recursoshumanos`);
  }

  public getBy(id): Observable<RecursoHumano> {
    return this.httpClient.get<RecursoHumano>(`${this.APIEndpoint}recursoshumanos/${id}`);
  }

  public update(id, dto): Observable<RecursoHumano> {
    return this.httpClient.put<RecursoHumano>(`${this.APIEndpoint}recursoshumanos/${id}`, dto);
  }

  public create(dto): Observable<RecursoHumano> {
    return this.httpClient.post<RecursoHumano>(`${this.APIEndpoint}recursoshumanos`, dto);
  }

  public delete(id): Observable<RecursoHumano> {
    return this.httpClient.delete<RecursoHumano>(`${this.APIEndpoint}recursoshumanos/${id}`);
  }
  private ParseDate(input: string) {
    if (!input || input.split("-").length != 3) return '';
    input = input.split("-")[2] + "/" + input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input, 'yyyy-MM-dd');
  }

  public validateFields(name, id = ""): Observable<any> {
    let params = new HttpParams()
      .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}recursoshumanos/attributes/${name}`, { params: params });
  }
  public listRecursosHumanosWithOutUser(id = null) {
    let params = new HttpParams();
    if(id){
      params = new HttpParams().set("idRecursoHumano",id);
    }
    return this.httpClient.get<RecursoHumano[]>(`${this.APIEndpoint}recursoshumanos/usuarios`, { params: params });

  }
}
