import { Servicio } from './servicio';

export class RecursoServicio {
    id: number;
    idRecurso: number;
    idServicio: number;
    fechaAsignado: string | null;
    fechaDesasignado: string | null;
    motivoDesasignacion: string;
    idMotivoDesasignacion: number | null;
    idUbicacion: number | null;
    servicio: Servicio;
    cliente: string;
    encargado:string;
}
export interface RecursoServicioFilter {
    fechaAsignadoFrom: string | null;
    fechaAsignadoTo: string | null;
    name: string|null;
}