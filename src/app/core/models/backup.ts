import { BaseEntity } from './base';

export interface Backup extends BaseEntity {
    id: string;
    name: string;
  
}

export interface BackupFilter {
    creationDateFrom: string | null;
    creationDateTo: string | null;
}