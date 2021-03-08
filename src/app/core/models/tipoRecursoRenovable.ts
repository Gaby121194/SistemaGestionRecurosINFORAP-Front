export class TipoRecursoRenovable {
    id: number;
    creationDate: string;
    descripcion: string;
}

export interface TipoRecursoRenovableFilter {
    name: string | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}