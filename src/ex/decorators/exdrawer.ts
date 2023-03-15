import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Variant} from "../variant";

import ExElements from "../../assets/ex/Borders/ex_elements.png";
import ExBorder from "../../assets/ex/Borders/ex.png";
import ExBorderEReader from "../../assets/ex/Borders/ex_e_reader.png";
import ExShatteredBorder from "../../assets/ex/Borders/shattered.png";
import {IsEvolved} from "../../pokemon/evolution";

export class ExDrawer extends AbstractElementDrawer{

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(pokemonEx.variant === Variant.EX || pokemonEx.variant === Variant.EX_SHATTERED){
            let imageSrc: string;
            if(pokemonEx.isEReader){
                imageSrc = ExBorderEReader;
            }
            else if(pokemonEx.variant === Variant.EX){
                imageSrc = ExBorder;
            }
            else if(pokemonEx.variant === Variant.EX_SHATTERED){
                imageSrc = ExShatteredBorder;
            }

            $(`<img class='card-element poke-ex-border' src='${imageSrc!}'>`)
                        .setElementPosition(0, 0, null, null)
                        .appendTo(this.root);

            $(`<img class='card-element poke-ex-elements' src="${ExElements}">`)
                        .setElementPosition(31, 33, null, null)
                        .applyStyleIf("z-index", 1, (): boolean => {
                            return IsEvolved(pokemonEx);
                        })
                        .appendTo(this.root);
        }
    }

}
