import { Recurso } from './recurso';
import { TipoRecurso } from './tipo-recurso';

export class ServicioRecurso {
    id: number | null;
    idRecurso: number;
    idServicio: number;
    fechaAsignado: string | null;
    fechaDesasignado: string | null;
    idMotivoDesasignacion: number | null;
    descripcion: string | null;
    ubicacion: string | null;
    estado: string | null;
    tipoRecurso: TipoRecurso | null;
    idEstado: number | null;
    idUbicacion: number | null;
    isStock: boolean | null;
    recurso : Recurso | null
}

export interface ServicioRecursoFilter {
    creationDateFrom: string | null;
    creationDateTo: string | null;
    idTipoRecurso: number | null;
}