export class TipoRecursoMaterial {
    id: number;
    creationDate: string;
    descripcion: string;
}

export interface TipoRecursoMaterialFilter {
    name: string | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}