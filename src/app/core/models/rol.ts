import { BaseEntity } from './base';
import { Empresa } from './empresa';
export class Rol extends BaseEntity {
    id: number | null;
    nombre: string;
    descripcion: string;
    idEmpresa: number | null;
    active: boolean | null;
    permisos: (number | null)[];
    empresa: Empresa;
}

export interface rolFilter {
    
    name: string | null;
    idEmpresa: string | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}