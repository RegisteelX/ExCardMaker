import {Type} from "./type";

export interface IAttack {
    name: string;
    text?: string;
    damage?: number | string;
    energyCost: Type[];
}
