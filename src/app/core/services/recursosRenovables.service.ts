import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recurso } from '../models/recurso';
import { RecursoRenovable, RecursoRenovableFilter } from '../models/recursosrenovables';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class RecursosRenovablesService extends BaseService{
 
  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }
  
  public list(): Observable<RecursoRenovable[]>{
    return this.httpClient.get<RecursoRenovable[]>(`${this.APIEndpoint}recursosrenovables`); 
  }

  public listBy(filter : RecursoRenovableFilter ): Observable<RecursoRenovable[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('idEstado', filter.idEstado? filter.idEstado.toString() : "")
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<RecursoRenovable[]>(`${this.APIEndpoint}recursosrenovables`, { params: params });
  }

  public getBy(id): Observable<RecursoRenovable> {
    return this.httpClient.get<RecursoRenovable>(`${this.APIEndpoint}recursosrenovables/${id}`);
  }

  public update(idRecursoRenovable,dto): Observable<RecursoRenovable> {
    return this.httpClient.put<RecursoRenovable>(`${this.APIEndpoint}recursosrenovables/${idRecursoRenovable}`,dto);
  }

  public create(entity) : Observable<RecursoRenovable>  {
    
    return this.httpClient.post<RecursoRenovable>(`${this.APIEndpoint}recursosrenovables`,entity);      
  }
  public delete(idRecursoRenovable) : Observable<RecursoRenovable> {
    return this.httpClient.delete<RecursoRenovable>(`${this.APIEndpoint}recursosrenovables/${idRecursoRenovable}`);
  }

  public StartoutOfService(idRecursoMaterial): Observable<RecursoRenovable> {
    return this.httpClient.delete<RecursoRenovable>(`${this.APIEndpoint}recursosrenovables/outofservice/${idRecursoMaterial}`);
  }
  public EndoutOfService(idRecursoMaterial): Observable<RecursoRenovable> {
    return this.httpClient.get<RecursoRenovable>(`${this.APIEndpoint}recursosrenovables/outofservice/${idRecursoMaterial}`);
  }



  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}recursosrenovables/attributes/${name}`,{params:params});
  }

  public ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
  


 
}
