import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Servicio, ServicioFilter } from '../models/servicio';
import { DateHelper } from '../helpers/date.helper';
import { MotivoBajaServicio } from '../models/motivo-baja-servicio';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService extends BaseService {

  constructor(httpClient: HttpClient, private dateHelper: DateHelper) { super(httpClient); }
  public list(): Observable<Servicio[]> {
    return this.httpClient.get<Servicio[]>(`${this.APIEndpoint}servicios`);
  }
  public listBy(filter: ServicioFilter): Observable<Servicio[]> {
    let params = new HttpParams()
      .set('name', filter.name)
      .set('fechaInicioFrom', this.dateHelper.ParseDateToString(filter.fechaInicioFrom))
      .set('fechaInicioTo', this.dateHelper.ParseDateToString(filter.fechaInicioTo))
      .set('fechaFinFrom', this.dateHelper.ParseDateToString(filter.fechaFinFrom))
      .set('fechaFinTo', this.dateHelper.ParseDateToString(filter.fechaFinTo))
    console.log(params)
    return this.httpClient.get<Servicio[]>(`${this.APIEndpoint}servicios`, { params: params });
  }
  public getBy(id): Observable<Servicio> {
    return this.httpClient.get<Servicio>(`${this.APIEndpoint}servicios/${id}`);
  }
  public update(id, servicio): Observable<Servicio> {
    return this.httpClient.put<Servicio>(`${this.APIEndpoint}servicios/${id}`, servicio);
  }
  public insert(servicio): Observable<Servicio> {
    return this.httpClient.post<Servicio>(`${this.APIEndpoint}servicios`, servicio);
  }
  public delete(id, idMotivoBaja, observaciones = "") {
    let params = new HttpParams()
      .set('observaciones', observaciones)
    return this.httpClient.delete(`${this.APIEndpoint}servicios/${id}/motivoBajaServicios/${idMotivoBaja}`,{params:params})
  }
  public listMotivoBajaServicios(): Observable<MotivoBajaServicio[]> {
    return this.httpClient.get<MotivoBajaServicio[]>(`${this.APIEndpoint}servicios/motivoBajaServicios`);
  }

  /**
   * Gerenate a contract number based in the max value
   */
  public generateContractNumber(): Observable<any> {
    return this.httpClient.get<any[]>(`${this.APIEndpoint}servicios/contratos`);
  }
  /**
   * validate unique fields
   */
  public validateUniqueFields(value, id = ""): Observable<any> {
    let params = new HttpParams()
      .set('id', id);
    return this.httpClient.get<any>(`${this.APIEndpoint}servicios/attributes/${value}`, { params: params });
  }

  public getHumanResourcesGroupedByMonths(fechaInicioFrom,fechaInicioTo, idServicio): Observable<any[]> {
    let from = this.dateHelper.ParseDateToString(fechaInicioFrom);
    let to = this.dateHelper.ParseDateToString(fechaInicioTo);   
    return this.httpClient.get<any[]>(`${this.APIEndpoint}servicios/analitycs/recursoshumanos/${idServicio}/${from}/${to}`);
  }

  public getActiveServicesGroupedByMonths(fechaInicioFrom,fechaInicioTo): Observable<any[]> {
    let from = this.dateHelper.ParseDateToString(fechaInicioFrom);
    let to = this.dateHelper.ParseDateToString(fechaInicioTo);   
    return this.httpClient.get<any[]>(`${this.APIEndpoint}servicios/analitycs/activos/${from}/${to}`);
  }
  public getServiciosActivosInactivos(fechaInicioFrom,fechaInicioTo): Observable<any> {
    let from = this.dateHelper.ParseDateToString(fechaInicioFrom);
    let to = this.dateHelper.ParseDateToString(fechaInicioTo);   
    return this.httpClient.get<any>(`${this.APIEndpoint}servicios/analitycs/activos/inactivos/${from}/${to}`);
  }
  public getServiciosInactivosMotivos(fechaInicioFrom,fechaInicioTo): Observable<any> {
    let from = this.dateHelper.ParseDateToString(fechaInicioFrom);
    let to = this.dateHelper.ParseDateToString(fechaInicioTo);   
    return this.httpClient.get<any>(`${this.APIEndpoint}servicios/analitycs/inactivos/${from}/${to}`);
  }


}
