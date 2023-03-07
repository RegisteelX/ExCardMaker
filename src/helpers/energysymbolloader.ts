import {Type} from "../pokemon/type";

export interface IEnergySymbolLoader {
    loadEnergySymbols(): Promise<void>;
    getSymbolImage(type: Type): HTMLElement;
    getSymbolSpan(type: Type): HTMLElement;
}
