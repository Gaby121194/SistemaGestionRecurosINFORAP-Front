import { BaseEntity } from './base';
import { Cliente } from './cliente';

 export interface Servicio extends BaseEntity{
    id: number;
    nombre: string;
    nroContrato: number | null;
    objetivo: string;
    fechaInicio: string | null;
    fechaBaja: string | null;
    motivoBaja: string;
    fechaFin: string | null;
    idEmpresa: number | null;
    idCliente: number | null;
    idRecursoHumano1: number | null;
    idRecursoHumano2: number | null;
    idMotivoBajaServicio: number | null;    
    cliente : Cliente | null; 
}

export class ServicioFilter {
    name: string | null;
    fechaInicioFrom: string | null;
    fechaInicioTo: string | null;
    fechaFinFrom: string | null;
    fechaFinTo: string | null;
}