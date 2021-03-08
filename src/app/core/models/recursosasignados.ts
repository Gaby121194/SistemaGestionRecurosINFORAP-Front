import { RecursoMaterial } from './recursosmateriales';
import { RecursoRenovable } from './recursosrenovables';

export class RecursoAsignado {
    id: number;
    idRecurso1: number;
    idRecurso2: number;
    fechaAsignado: string | null;
    fechaDesasignado: string | null;
    motivoDesasignacion: string;
    idMotivoDesasignacion: number | null;
    idUbicacion: number | null;
    nombreRecurso2: string;
    referenciaUbicacion: string;
    fechaVencimiento: string;
    recursoMaterial: RecursoMaterial | null;
    recursoRenovable: RecursoRenovable |null;
    isStock: boolean | null;
}

export interface RecursoAsignadoFilter {
    name: string | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}