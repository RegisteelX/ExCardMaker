import {Type} from "../pokemon/type";
import {SymbolSize} from "../neo/neoenergysymbolloader";

export interface IEnergySymbolLoader {
    loadEnergySymbols(): Promise<void>;
    getSymbolImage(type: Type, size: SymbolSize): HTMLElement;
    getSymbolSpan(type: Type): HTMLElement;
}
