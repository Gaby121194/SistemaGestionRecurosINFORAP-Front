import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Empresa, empresaFilter } from '../models/empresa';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService extends BaseService {

  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }

  public list(): Observable<Empresa[]> {
    return this.httpClient.get<Empresa[]>(`${this.APIEndpoint}empresas`);
  }
  public listBy(filter: empresaFilter): Observable<Empresa[]>{
    let params = new HttpParams()
      .set('idEmpresa', filter.idEmpresa.toString())
      .set('active', filter.active)
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
      
    return this.httpClient.get<Empresa[]>(`${this.APIEndpoint}empresas`, { params : params})
  } 

  public activate(id): Observable<Empresa> {
    return this.httpClient.get<Empresa>(`${this.APIEndpoint}empresas/activate/${id}`,);
  }

  public getBy(id): Observable<Empresa> {
    return this.httpClient.get<Empresa>(`${this.APIEndpoint}empresas/${id}`);
  }

  public update(id,empresa): Observable<Empresa> {
    return this.httpClient.put<Empresa>(`${this.APIEndpoint}empresas/${id}`,empresa);
  }

  public create(empresa) : Observable<Empresa>  {
    return this.httpClient.post<Empresa>(`${this.APIEndpoint}empresas`,empresa);    
  } 

  public delete(id) : Observable<Empresa> {
    return this.httpClient.delete<Empresa>(`${this.APIEndpoint}empresas/${id}`); 
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}empresas/attributes/${name}`,{params:params});
  }

}