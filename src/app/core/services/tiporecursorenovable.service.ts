import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoRecursoRenovable, TipoRecursoRenovableFilter } from '../models/tipoRecursoRenovable';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TiporecursorenovableService extends BaseService{
  
  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient) 
  }

  public list(): Observable<TipoRecursoRenovable[]> {
    return this.httpClient.get<TipoRecursoRenovable[]>(`${this.APIEndpoint}tiposrecursosrenovables`);
  }

  public listBy(filter : TipoRecursoRenovableFilter): Observable<TipoRecursoRenovable[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<TipoRecursoRenovable[]>(`${this.APIEndpoint}tiposrecursosrenovables`, { params: params });
  }

  public create(entity) : Observable<TipoRecursoRenovable>  {
    return this.httpClient.post<TipoRecursoRenovable>(`${this.APIEndpoint}tiposrecursosrenovables`,entity);      
  }

  public update(id, TipoRecursoMaterial): Observable<TipoRecursoRenovable> {
    return this.httpClient.put<TipoRecursoRenovable>(`${this.APIEndpoint}tiposrecursosrenovables/${id}`, TipoRecursoMaterial);
  }

  public getBy(id): Observable<TipoRecursoRenovable> {
    return this.httpClient.get<TipoRecursoRenovable>(`${this.APIEndpoint}tiposrecursosrenovables/${id}`);
  }

  public delete(id) : Observable<TipoRecursoRenovable> {
    return this.httpClient.delete<TipoRecursoRenovable>(`${this.APIEndpoint}tiposrecursosrenovables/${id}`);
  }

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}tiposrecursosrenovables/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
}
