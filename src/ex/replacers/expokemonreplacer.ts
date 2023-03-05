import {IStringReplacer} from "../../helpers/stringreplacer";

export class ExPokemonReplacer implements IStringReplacer {
    private readonly pattern = /Pokemon/g;

    public replace(str: string): string {
        return str.replace(this.pattern, 'Pokémon');
    }
}
