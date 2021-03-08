import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { View } from '../models/view';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionalidadService extends BaseService {

  constructor(private datePipe: DatePipe, protected httpClient: HttpClient) {
    super(httpClient)
  }

  public list(filter = null): Observable<View[]> {
    if(filter){
      let params = new HttpParams()
        .set('name', filter.name)
        .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
        .set('creationDateTo', this.ParseDate(filter.creationDateTo));
      return this.httpClient.get<View[]>(`${this.APIEndpoint}funcionalidad`, { params: params });
    }else{
      return this.httpClient.get<View[]>(`${this.APIEndpoint}funcionalidad`)
    }
  }
  public getBy(id): Observable<View> {
    return this.httpClient.get<View>(`${this.APIEndpoint}funcionalidad/${id}`);
  }

  public create(view): Observable<View> {
    return this.httpClient.post<View>(`${this.APIEndpoint}funcionalidad`, view);
  }
  public update(id, view): Observable<View> {
    return this.httpClient.put<View>(`${this.APIEndpoint}funcionalidad/${id}`, view);
  }
  public disable(id)  {
    return this.httpClient.delete(`${this.APIEndpoint}funcionalidad/${id}`); 
  }
  public enable(id) {
    return this.httpClient.patch(`${this.APIEndpoint}funcionalidad/${id}`,{});
  }

  public validateFields(fieldName, value, id = ""): Observable<any> {
    let params = new HttpParams()
      .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}funcionalidad/attributes/${fieldName}/${value}`, { params: params });
  }
  private ParseDate(input: string) {
    if (!input || input.split("-").length != 3) return '';
    input = input.split("-")[2] + "/" + input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input, 'yyyy-MM-dd');
  }

}
