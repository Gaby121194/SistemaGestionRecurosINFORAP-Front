import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DateHelper } from '../helpers/date.helper';
import { Backup, BackupFilter } from '../models/backup';
import { Cliente } from '../models/cliente';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class BackupService extends BaseService {

  constructor(httpClient: HttpClient, private dateHelper: DateHelper) { super(httpClient); }

  public listBy(filter: BackupFilter): Observable<Backup[]> {
    let params = new HttpParams()
      .set('creationDateFrom', this.dateHelper.ParseDateToString(filter.creationDateFrom))
      .set('creationDateTo', this.dateHelper.ParseDateToString(filter.creationDateTo));
    return this.httpClient.get<Backup[]>(`${this.APIEndpoint}backups`, { params: params });
  }
  public restore(key) {
    return this.httpClient.delete(`${this.APIEndpoint}backups/${key}`);
  }
}
