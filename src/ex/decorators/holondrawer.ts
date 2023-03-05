import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Variant} from "../variant";

import HolonSpecialElement from "../../assets/ex/Borders/holon_special.png"
import HolonNormalElement from "../../assets/ex/Borders/holon_normal.png"

import HolonSpecialCutoffElement from "../../assets/ex/Borders/holon_special_cutoff.png"
import HolonNormalCutoffElement from "../../assets/ex/Borders/holon_normal_cutoff.png"

export class HolonDrawer extends AbstractElementDrawer{

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(pokemonEx.holon != null){
            const holonElement = $(`<img class='card-element'>`);

            if(pokemonEx.holon.specialType){
                holonElement.attr("src", pokemonEx.variant === Variant.STANDARD ? HolonSpecialElement : HolonSpecialCutoffElement);
                holonElement.setElementPosition(null, null, 39, 115);
            }
            else{
                holonElement.attr("src", pokemonEx.variant === Variant.STANDARD ? HolonNormalElement : HolonNormalCutoffElement);
                holonElement.setElementPosition(null, null, 39, 115);
            }

            holonElement.appendTo(this.root);
        }
    }

}
