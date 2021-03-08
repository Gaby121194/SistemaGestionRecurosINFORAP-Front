import { BaseEntity } from './base';

export class RecursoHumano extends BaseEntity{
    id: number| null;
    idRecurso: number;
    cuil: string;
    direccion: string;
    multiservicio: boolean | null;
    email: string;
    fechaNacimiento: Date | null;
    telefono: string;
    nombre: string;
    apellido: string;
    nroLegajo: string;
    idEmpresa: number| null;
    imagen: string | null;
}
export interface recursoHumanoFilter {
    name: string | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}