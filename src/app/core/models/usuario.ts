import { Rol } from './rol';
import { Empresa } from './empresa';
import { BaseEntity } from './base';

export class Usuario extends BaseEntity {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    idEmpresa: number;
    idRecursoHumano: number | null;
    idRol: number | null;
    active: boolean | null;
    rol : Rol; 
    empresa : Empresa;
 }
 export interface UsuarioFilter {
    name: string | null;
    idEmpresa: string | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}