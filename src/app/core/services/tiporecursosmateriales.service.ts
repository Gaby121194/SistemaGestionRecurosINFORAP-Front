import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { TipoRecursoMaterial, TipoRecursoMaterialFilter } from '../models/tiporecursomaterial';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TiporecursosmaterialesService extends BaseService {

  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }

  public list(): Observable<TipoRecursoMaterial[]> {
    return this.httpClient.get<TipoRecursoMaterial[]>(`${this.APIEndpoint}tiposrecursosmateriales`);
  }

  public listBy(filter : TipoRecursoMaterialFilter): Observable<TipoRecursoMaterial[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<TipoRecursoMaterial[]>(`${this.APIEndpoint}tiposrecursosmateriales`, { params: params });
  }

  public create(entity) : Observable<TipoRecursoMaterial>  {
    return this.httpClient.post<TipoRecursoMaterial>(`${this.APIEndpoint}tiposrecursosmateriales`,entity);      
  }

  public update(id, TipoRecursoMaterial): Observable<TipoRecursoMaterial> {
    return this.httpClient.put<TipoRecursoMaterial>(`${this.APIEndpoint}tiposrecursosmateriales/${id}`, TipoRecursoMaterial);
  }

  public getBy(id): Observable<TipoRecursoMaterial> {
    return this.httpClient.get<TipoRecursoMaterial>(`${this.APIEndpoint}tiposrecursosmateriales/${id}`);
  }

  public delete(id) : Observable<TipoRecursoMaterial> {
    return this.httpClient.delete<TipoRecursoMaterial>(`${this.APIEndpoint}tiposrecursosmateriales/${id}`);
  }

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}tiposrecursosmateriales/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }

}
