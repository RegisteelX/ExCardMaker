import {AbstractElementDrawer} from "./abstractelementdrawer";
import {Type} from "../../pokemon/type";
import {IPokemonEx} from "../pokemonex";

export class HPDrawer extends AbstractElementDrawer{

    public async drawElement(): Promise<void> {
        $(`<p class='poke-hp card-element'>${this.pokemon.hp}<span class="scaled-space"></span>HP</p>`)
            .setElementPosition(52, null, 112, null)
            .applyStyleIf("color", "#FFF", (): boolean => {
                return this.mustInvert();
            })
            .appendTo(this.root);
    }

    private mustInvert(): boolean{
        const pokemonEx = this.pokemon as IPokemonEx;
        return this.PokemonIsOfType(Type.Dark) || this.PokemonIsOfType(Type.Dragon) || pokemonEx.subFlags.isDark;
    }
}
