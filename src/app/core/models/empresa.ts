export class Empresa {
    id: number | null;
    razonSocial: string;
    domicilio: string;
    logo: string;
    cuit: string;
    telefono: string;
    correoContacto: string;
    usuarioContacto: string;
    active: boolean;
    creationDate: string;
}

export interface empresaFilter {
    name: string | null;
    active: string | null;
    idEmpresa: number | null;
    creationDateFrom: string | null;
    creationDateTo: string | null;
}