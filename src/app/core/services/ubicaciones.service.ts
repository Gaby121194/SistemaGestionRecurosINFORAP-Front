import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Ubicacion, ubicacionFilter } from '../models/ubicacion';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UbicacionesService extends BaseService {

  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }

  public list(): Observable<Ubicacion[]> {
    return this.httpClient.get<Ubicacion[]>(`${this.APIEndpoint}ubicaciones`);
  }

  public listForStock(id) : Observable<Ubicacion[]> {
    return this.httpClient.get<Ubicacion[]>(`${this.APIEndpoint}ubicaciones/stockrecursomaterial/${id}`);
  }

  public listBy(filter : ubicacionFilter): Observable<Ubicacion[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<Ubicacion[]>(`${this.APIEndpoint}ubicaciones`, { params: params });
  }

  public getBy(idUbicacion): Observable<Ubicacion> {
    return this.httpClient.get<Ubicacion>(`${this.APIEndpoint}ubicaciones/${idUbicacion}`);
  }

  public update(idUbicacion,dto): Observable<Ubicacion> {
    return this.httpClient.put<Ubicacion>(`${this.APIEndpoint}ubicaciones/${idUbicacion}`,dto);
  }

  public create(entity) : Observable<Ubicacion>  {
    return this.httpClient.post<Ubicacion>(`${this.APIEndpoint}ubicaciones`,entity);      
  }
  
  public delete(id) : Observable<Ubicacion> {
    return this.httpClient.delete<Ubicacion>(`${this.APIEndpoint}ubicaciones/${id}`)    
  }

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}ubicaciones/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
}
