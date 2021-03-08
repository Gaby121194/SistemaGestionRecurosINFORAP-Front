import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { StockRecursoMaterial, StockRecursoMaterialFilter } from '../models/stockrecursomaterial';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class StockrecursosmaterialesService extends BaseService {

  constructor(private datePipe : DatePipe, protected httpClient : HttpClient){
    super(httpClient)
  }
  
  public list(id): Observable<StockRecursoMaterial[]>{
    return this.httpClient.get<StockRecursoMaterial[]>(`${this.APIEndpoint}stockrecursosmateriales/recursoMaterial/${id}`);
  }

  public listBy(id, filter : StockRecursoMaterialFilter ): Observable<StockRecursoMaterial[]>{
    let params = new HttpParams()
      .set('name', filter.name)
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<StockRecursoMaterial[]>(`${this.APIEndpoint}stockrecursosmateriales/recursoMaterial/${id}`, { params: params });
  }

  public getBy(id): Observable<StockRecursoMaterial>{
    return this.httpClient.get<StockRecursoMaterial>(`${this.APIEndpoint}stockrecursosmateriales/${id}`);
  }

  public update(id, dto):  Observable<StockRecursoMaterial>{
    return this.httpClient.put<StockRecursoMaterial>(`${this.APIEndpoint}stockrecursosmateriales/${id}`, dto);
  }
  public delete(id) : Observable<StockRecursoMaterial> {
    return this.httpClient.delete<StockRecursoMaterial>(`${this.APIEndpoint}stockrecursosmateriales/${id}`);
  }

  public create(dto):  Observable<StockRecursoMaterial>{
    return this.httpClient.post<StockRecursoMaterial>(`${this.APIEndpoint}stockrecursosmateriales`, dto);
  } 

  public validateFields(name,id=""): Observable<any> {
    let params = new HttpParams()
    .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}stockrecursosmateriales/attributes/${name}`,{params:params});
  }

  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
}
