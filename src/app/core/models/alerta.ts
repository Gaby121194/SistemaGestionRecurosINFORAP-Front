import { BaseEntity } from './base';
import { Recurso } from './recurso';
import { Requisito } from './requisito';

export interface Alerta extends BaseEntity {
    id: number | null;
    nombre: string;
    descripcion: string;
    idEstado: number | null;
    fechaFin: string | null;
    observacion: string;
    idRequisito: number | null;
    idFueraServicio: number | null;
    idRecurso1: number | null;
    idRecurso2: number | null;
    requisito: Requisito;
    recursos: Recurso[];
}