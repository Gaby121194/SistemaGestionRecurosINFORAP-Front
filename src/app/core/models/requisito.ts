import { BaseEntity } from './base';
import { TipoRegla } from './tipo-regla';
import { TipoRecurso } from './tipoRecurso';

export class Requisito extends BaseEntity {
    id: number | null;
    descripcion: string;
    idTipoRequisito: number | null;
    activo: boolean | null;
    periodicidad: number | null;
    fechaCumplido: Date | null;
    observaciones: string;
    fechaVencimiento: Date | null;
    validarVigencia: boolean | null;
    idServicio: number | null;
    idTipoRecurso1: number | null;
    idTipoRecurso2: number | null;
    tipoRequisito: string | null;
    idTipoRegla: number | null;
    idTipoRecursoMaterial1: number | null;
    idTipoRecursoMaterial2: number | null;
    idTipoRecursoRenovable: number | null;
    idUtiempo: number | null;
    tipoRegla : TipoRegla | null;  
    tipoRecurso1 : TipoRecurso | null;
    tipoRecurso2 : TipoRecurso | null;
    habilitado : boolean | null;
    transcripcionRegla : string | null;
}