import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";

import DeltaBorderBasic from "../../assets/ex/Borders/delta_border_basic.png";
import DeltaBorderEvolution from "../../assets/ex/Borders/delta_border_evolution.png";
import DeltaShiningOverlay from "../../assets/ex/Borders/delta_shining_overlay.png";

import {Variant} from "../variant";
import {IsEvolved} from "../../pokemon/evolution";

export class DeltaDrawer extends AbstractElementDrawer{

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(pokemonEx.isDeltaSpecies){
            if(pokemonEx.variant != Variant.GOLDSTAR){
                const deltaSpeciesBorder = $(`<img src='${IsEvolved(pokemonEx) ? DeltaBorderEvolution : DeltaBorderBasic}' class='poke-delta-species-border card-element'>`)
                deltaSpeciesBorder
                    .setElementPosition(61, 33, 0, 0)
                    .applyStyleIf("left", 42, (): boolean => {
                        return IsEvolved(pokemonEx);
                    })
                    .appendTo(this.root);
            }
            else{
                console.log(DeltaShiningOverlay)
                $(`<img src=${DeltaShiningOverlay} class="poke-delta-species-border card-element"/>`)
                    .setElementPosition(417, 69, null, null)
                    .appendTo(this.root)
            }
        }
    }

}
