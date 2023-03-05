import {IStringReplacer} from "../helpers/stringreplacer";
import {NeoEnergySymbolLoader} from "./neoenergysymbolloader";
import {Type} from "../pokemon/type";

export class NeoEnergySymbolReplacer implements IStringReplacer {
    private readonly pattern = /\[(.*?)\]/g;

    private readonly table: { [key: string]: Type } = {
        "C": Type.Colorless,
        "D": Type.Dragon,
        "F": Type.Fire,
        "G": Type.Grass,
        "L": Type.Electric,
        "O": Type.Dark,
        "P": Type.Psychic,
        "S": Type.Steel,
        "W": Type.Water,
        "R": Type.Fire,
        "Z": Type.Fairy
    }

    public replace(str: string): string {
        return str.replace(this.pattern, (match: string, p1: string) => {
            const symbol: Type | undefined = this.table[p1] as Type;
            if (symbol) {
                const elem = NeoEnergySymbolLoader
                            .getInstance()
                            .getSymbolSpan(symbol);
                elem.classList.add(`poke-energy-symbol-span-${p1.toLowerCase()}`);

                const wrapper = $("<span class='poke-energy-symbol-span-wrapper'></span>");
                wrapper.append(elem);

                return wrapper.prop('outerHTML');
            }
            return match;
        });
    }
}
