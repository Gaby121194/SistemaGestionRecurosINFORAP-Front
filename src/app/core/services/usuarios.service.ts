import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Usuario, UsuarioFilter } from '../models/usuario';
import { AuthenticationToken } from '../models/token';
import { HttpParams, HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends BaseService {
  constructor(private datePipe: DatePipe,protected httpClient: HttpClient){
    super(httpClient)
  }
  public list(): Observable<Usuario[]> {

    return this.httpClient.get<Usuario[]>(`${this.APIEndpoint}usuarios`);
  }
  public listBy(filter: UsuarioFilter): Observable<Usuario[]> {
 
    let params = new HttpParams()

      .set('name', filter.name)
      .set('idEmpresa', filter.idEmpresa ? filter.idEmpresa : '')
      .set('creationDateFrom', this.ParseDate(filter.creationDateFrom))
      .set('creationDateTo', this.ParseDate(filter.creationDateTo));
    return this.httpClient.get<Usuario[]>(`${this.APIEndpoint}usuarios`, { params: params });
  }
  public getBy(id): Observable<Usuario> {
    return this.httpClient.get<Usuario>(`${this.APIEndpoint}usuarios/${id}`);
  }
  public update(id, user): Observable<Usuario> {
    return this.httpClient.put<Usuario>(`${this.APIEndpoint}usuarios/${id}`, user);
  }
  public insert(user): Observable<Usuario> {
    return this.httpClient.post<Usuario>(`${this.APIEndpoint}usuarios`, user);
  }
  public delete(id) {
    return this.httpClient.delete(`${this.APIEndpoint}usuarios/${id}`)
  }

  public login(user): Observable<AuthenticationToken> {
    return this.httpClient.post<AuthenticationToken>
      (`${this.APIEndpoint}authentication`, user);
  }
  public recoveryPassword(username) {
    return this.httpClient.get
      (`${this.APIEndpoint}authentication/${username}`);
  }
  public validateUsername(username): Observable<any> {
    return this.httpClient.get<any>
      (`${this.APIEndpoint}usuarios/attributes/${username}`);
  }
  private ParseDate(input: string) {
    if(!input || input.split("-").length!= 3) return '';
     input = input.split("-")[2] + "/" +  input.split("-")[1] + "/" + input.split("-")[0]
    return this.datePipe.transform(input,'yyyy-MM-dd');
  }
}
