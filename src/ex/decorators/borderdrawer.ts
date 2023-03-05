import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Variant} from "../variant";

import ExShatteredBorder from "../../assets/ex/Borders/shattered.png";

export class BorderDrawer extends AbstractElementDrawer{

    private border = new Image();

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;

        this.border.classList.add("card-border");
        if(pokemonEx.variant === Variant.EX_SHATTERED){
            this.border.src = ExShatteredBorder;
        }

        if(this.border.src !== ""){
            this.root.append(this.border);
        }
    }

}
