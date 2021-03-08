import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { RecursoMaterial, RecursoMaterialFilter } from "../models/recursosmateriales";
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RecursosmaterialesService extends BaseService {

  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }
  
  public list(): Observable<RecursoMaterial[]>{
    return this.httpClient.get<RecursoMaterial[]>(`${this.APIEndpoint}recursosmateriales`); 
  }

  public listBy(filter : RecursoMaterialFilter ): Observable<RecursoMaterial[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('idEstado', filter.idEstado? filter.idEstado.toString() : "")
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<RecursoMaterial[]>(`${this.APIEndpoint}recursosmateriales`, { params: params });
  }

  public getBy(id): Observable<RecursoMaterial> {
    return this.httpClient.get<RecursoMaterial>(`${this.APIEndpoint}recursosmateriales/${id}`);
  }

  public update(idRecursoMaterial,dto): Observable<RecursoMaterial> {
    return this.httpClient.put<RecursoMaterial>(`${this.APIEndpoint}recursosmateriales/${idRecursoMaterial}`,dto);
  }

  public create(entity) : Observable<RecursoMaterial>  {
    return this.httpClient.post<RecursoMaterial>(`${this.APIEndpoint}recursosmateriales`,entity);      
  }
  public delete(idRecursoMaterial) : Observable<RecursoMaterial> {
    return this.httpClient.delete<RecursoMaterial>(`${this.APIEndpoint}recursosmateriales/${idRecursoMaterial}`);
  }

  public StartoutOfService(idRecursoMaterial): Observable<RecursoMaterial> {
    return this.httpClient.delete<RecursoMaterial>(`${this.APIEndpoint}recursosmateriales/outofservice/${idRecursoMaterial}`);
  }
  public EndoutOfService(idRecursoMaterial): Observable<RecursoMaterial> {
    return this.httpClient.get<RecursoMaterial>(`${this.APIEndpoint}recursosmateriales/outofservice/${idRecursoMaterial}`);
  }



  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}recursosmateriales/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
}
