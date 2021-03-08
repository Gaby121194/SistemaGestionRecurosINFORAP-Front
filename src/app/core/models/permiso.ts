import { BaseEntity } from './base';

export interface Permiso extends BaseEntity {
    id: number | null;
    nombrePermiso: string;
    descripcionPermiso: string;
    controllersIds : number[];
}