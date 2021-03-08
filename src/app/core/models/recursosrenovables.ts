import { Estado } from './estado';
import { Recurso } from './recurso';
import { TipoRecursoRenovable } from './tipoRecursoRenovable';

export class RecursoRenovable {
    id: number | null ;
    idRecurso: number | null ;
    idTipoRecursoRenovable: number;
    fechaVencimiento: string | null ;
    idTipoRecurso: number | null;
    idEstado: number ;
    ubicacion: string | null;
    idUbicacion: number ;
    fechaCreacion: string | null;
    idRecursoNavigation : Recurso | null ;
    idTipoRecursoRenovableNavigation: TipoRecursoRenovable | null;
}

export interface RecursoRenovableFilter {
    name: string | null;
    idEstado: number | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}