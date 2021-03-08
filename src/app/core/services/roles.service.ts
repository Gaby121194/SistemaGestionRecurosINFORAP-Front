import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Rol, rolFilter } from "../models/rol";
import { HttpParams, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService{

  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }

  public list(): Observable<Rol[]> {
    return this.httpClient.get<Rol[]>(`${this.APIEndpoint}roles`);
  }

  public listBy(filter: rolFilter): Observable<Rol[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('idEmpresa', filter.idEmpresa ? filter.idEmpresa : '')
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<Rol[]>(`${this.APIEndpoint}roles`, { params : params})
  } 
  public create(entity) : Observable<Rol>  {
    return this.httpClient.post<Rol>
    (`${this.APIEndpoint}roles`,entity);    
  } 
  public getBy(id): Observable<Rol> {
    return this.httpClient.get<Rol>(`${this.APIEndpoint}roles/${id}`);
  }
  public update(id,user): Observable<Rol> {
    return this.httpClient.put<Rol>(`${this.APIEndpoint}roles/${id}`,user);
  }

  public listByEmpresaId(id:Number): Observable<Rol[]> {
    return this.httpClient.get<Rol[]>(`${this.APIEndpoint}roles/empresas/${id}`);
  }

  public delete(id) : Observable<Rol> {
    return this.httpClient.delete<Rol>(`${this.APIEndpoint}roles/${id}`);
  }

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}roles/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }

  
}
