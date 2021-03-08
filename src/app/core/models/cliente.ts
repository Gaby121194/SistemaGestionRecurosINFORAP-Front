import { Empresa } from './empresa';

export class Cliente {
    id: number | null;
    razonSocial: string;
    telefono: string;
    email: string;
    cuil: string;
    idEmpresa: number | null;
    creationDate: string;
    empresa : Empresa;
}

export interface clienteFilter {
    name: string | null;
    idEmpresa: number | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}