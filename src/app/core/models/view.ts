import { BaseEntity } from './base';

export interface View extends BaseEntity {
    id: number;
    url: string;
    display: string;
    show: boolean;
    icon : string;
    active : boolean;
}