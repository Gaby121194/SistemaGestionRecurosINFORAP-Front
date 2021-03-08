import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Recurso } from '../models/recurso';
import { ServicioRecurso, ServicioRecursoFilter } from '../models/servicio-recurso';
import { RecursoHumano } from '../models/recurso-humano';
import { RecursoMaterial } from '../models/recursosmateriales';
import { RecursoAsignado, RecursoAsignadoFilter } from '../models/recursosasignados';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DateHelper } from '../helpers/date.helper';
import { RecursoServicio,RecursoServicioFilter } from '../models/recursoservicio';
import { RecursoRenovable } from '../models/recursosrenovables';


@Injectable({
  providedIn: 'root'
})
export class RecursoService extends BaseService {
  constructor(httpClient: HttpClient, private dateHelper: DateHelper, private datePipe : DatePipe) { super(httpClient); }
  public list(): Observable<Recurso[]> {
    return this.httpClient.get<Recurso[]>(`${this.APIEndpoint}recursos`);
  }
  public create(recurso): Observable<Recurso> {
    return this.httpClient.post<Recurso>
      (`${this.APIEndpoint}recursos`, recurso);
  }

  public getBy(id): Observable<Recurso> {
    return this.httpClient.get<Recurso>(`${this.APIEndpoint}recursos/${id}`);
  }
  public update(id, tipoRecurso): Observable<Recurso> {
    return this.httpClient.put<Recurso>(`${this.APIEndpoint}recursos/${id}`, tipoRecurso);
  }

  public insertRenovableAsignado(recursoAsignado): Observable<RecursoAsignado> {
    return this.httpClient.post<RecursoAsignado>(`${this.APIEndpoint}recursos/recursosAsignados/renovables`, recursoAsignado);
  }

  public insertMaterialAsignado(recursoAsignado): Observable<RecursoAsignado> {
    return this.httpClient.post<RecursoAsignado>(`${this.APIEndpoint}recursos/recursosAsignados/materiales`, recursoAsignado);
  }

  public listRenovablesAsignados(id, filter: RecursoAsignadoFilter): Observable<RecursoAsignado[]> {
    let params = new HttpParams()
    .set('name', filter.name)
    .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
    .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<RecursoAsignado[]>(`${this.APIEndpoint}recursos/recursosAsignados/renovables/${id}`, {params : params});
  }

  public listMaterialesAsignados(id, filter: RecursoAsignadoFilter): Observable<RecursoAsignado[]> {
    let params = new HttpParams()
    .set('name', filter.name)
    .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
    .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<RecursoAsignado[]>(`${this.APIEndpoint}recursos/recursosAsignados/materiales/${id}`, {params : params});
  }
  public listFromService(idServicio): Observable<ServicioRecurso[]> {
    return this.httpClient.get<ServicioRecurso[]>(`${this.APIEndpoint}recursos/servicios/${idServicio}`);
  }
  public listFromServiceBy(idServicio,filter : ServicioRecursoFilter): Observable<ServicioRecurso[]> {
    let params = new HttpParams()
    .set('creationDateFrom', this.dateHelper.ParseDateToString(filter.creationDateFrom))
    .set('creationDateTo', this.dateHelper.ParseDateToString(filter.creationDateTo))
    .set('idTipoRecurso', filter.idTipoRecurso?filter.idTipoRecurso.toString() : "")
     return this.httpClient.get<ServicioRecurso[]>(`${this.APIEndpoint}recursos/servicios/${idServicio}`,{params:params});
  }
  public listRecursosHumanosAvailable(idServicio = null): Observable<RecursoHumano[]> {
    var params = new HttpParams();
    if(idServicio){
      params =  new HttpParams().set("idServicio",idServicio);
    }
    return this.httpClient.get<RecursoHumano[]>(`${this.APIEndpoint}recursos/recursosHumanos/servicios`,{params:params});
  }
  public listRecursosMaterialesAvailable(idServicio): Observable<RecursoMaterial[]> {
    return this.httpClient.get<RecursoMaterial[]>(`${this.APIEndpoint}recursos/recursosMateriales/servicios/${idServicio}`);
  }
  public insertServicioRecurso(idServicio, servicioRecurso) {
    return this.httpClient.post(`${this.APIEndpoint}recursos/servicios/${idServicio}`, servicioRecurso);
  }
  public removeServicioRecurso(idServicioRecurso) {
    return this.httpClient.delete(`${this.APIEndpoint}recursos/servicioRecursos/${idServicioRecurso}`);
  }

  public deleteRecursoAsignado(idRecursoAsignado){
    return this.httpClient.delete(`${this.APIEndpoint}recursos/recursosAsignados/${idRecursoAsignado}`);
  }
  
  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }

  public listRRMMFromRecurso(idRecurso1): Observable<RecursoMaterial[]> {
    let params = new HttpParams()
    .set('idRecurso1', idRecurso1)
    return this.httpClient.get<RecursoMaterial[]>(`${this.APIEndpoint}recursos/recursosAsignados/materiales`, {params : params});
  }

  public listRRRRFromRecurso(idRecurso1): Observable<RecursoRenovable[]>{
    let params = new HttpParams()
    .set('idRecurso1', idRecurso1)
    return this.httpClient.get<RecursoRenovable[]>(`${this.APIEndpoint}recursos/recursosAsignados/renovables`, {params : params});
  }
  public listServiciosAsignados(idRecurso,filter: RecursoServicioFilter): Observable<RecursoServicio[]> {
    let params = new HttpParams()
    .set('fechaAsignadoFrom', this.dateHelper.ParseDateToString(filter.fechaAsignadoFrom))
    .set('fechaAsignadoTo', this.dateHelper.ParseDateToString(filter.fechaAsignadoTo))
    .set('name', filter.name)
    return this.httpClient.get<RecursoServicio[]>(`${this.APIEndpoint}recursos/recursosAsignados/${idRecurso}`,{params:params});;
  }

  public ListMaterialesWhereAsignado(idRecurso):Observable<RecursoAsignado[]>{
    return this.httpClient.get<RecursoAsignado[]>(`${this.APIEndpoint}recursos/recursosAsignados/materiales/To/${idRecurso}`)
  }

}
