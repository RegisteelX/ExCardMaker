import {IStringReplacer} from "../../helpers/stringreplacer";
import {Type} from "../../pokemon/type";
import {ExEnergySymbolLoader} from "../exenergysymbolloader";

export class ExEnergySymbolReplacer implements IStringReplacer {
    private readonly pattern = /\[(.*?)\]/g;

    private readonly symbolLoader: ExEnergySymbolLoader;

    public constructor() {
        this.symbolLoader = new ExEnergySymbolLoader();
    }

    private readonly table: { [key: string]: Type } = {
        "C": Type.Colorless,
        "F": Type.Fighting,
        "R": Type.Fire,
        "G": Type.Grass,
        "L": Type.Electric,
        "D": Type.Dark,
        "P": Type.Psychic,
        "S": Type.Steel,
        "W": Type.Water
    }

    public replace(str: string): string {
        return str.replace(this.pattern, (match: string, p1: string) => {
            const symbol: Type | undefined = this.table[p1] as Type;
            if (symbol) {
                const elem = this.symbolLoader.getSymbolSpan(symbol);
                elem.classList.add(`poke-energy-symbol-span-${p1.toLowerCase()}`);

                const wrapper = $("<span class='poke-energy-symbol-span-wrapper'></span>");
                wrapper.append(elem);

                return wrapper.prop('outerHTML');
            }
            return match;
        });
    }
}
