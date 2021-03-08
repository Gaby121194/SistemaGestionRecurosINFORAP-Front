
import { Recurso } from './recurso';
import { TipoRecursoMaterial } from './tiporecursomaterial';

export class RecursoMaterial {
    id: number | null;
    marca: string;
    modelo: string;
    diasFueraServicio: number | null;
    idRecurso: number;
    multiservicio: boolean | null;
    stockeable: boolean | null;
    idTipoRecursoMaterial: number;
    idEstado: number | null;
    idEmpresa: number | null;
    idUsuario: number | null;
    idUbicacion: number | null;
    creationDate: string | null ;
    idRecursoNavigation : Recurso | null ;
    idTipoRecursoMaterialNavigation: TipoRecursoMaterial | null;
    fechaInicioFueraServicio: string;
    boolAsignados : boolean;
}


export interface RecursoMaterialFilter {
    name: string | null;
    idEstado: number | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}