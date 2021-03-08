import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente,clienteFilter } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends BaseService {
  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }

  public list(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.APIEndpoint}clientes`);
  }

  public listBy(filter : clienteFilter): Observable<Cliente[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<Cliente[]>(`${this.APIEndpoint}clientes`, { params: params });
  }

  public getBy(idUbicacion): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.APIEndpoint}clientes/${idUbicacion}`);
  }

  public update(idUbicacion,dto): Observable<Cliente> {
    return this.httpClient.put<Cliente>(`${this.APIEndpoint}clientes/${idUbicacion}`,dto);
  }

  public create(entity) : Observable<Cliente>  {
    return this.httpClient.post<Cliente>(`${this.APIEndpoint}clientes`,entity);      
  }
  
  public delete(id) : Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.APIEndpoint}clientes/${id}`)    
  }

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}clientes/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
}