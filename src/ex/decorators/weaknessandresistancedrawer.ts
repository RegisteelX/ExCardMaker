import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Type} from "../../pokemon/type";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {ExEnergySymbolLoader} from "../exenergysymbolloader";

import NoResistanceText from "../../assets/ex/Symbols/resistance_n.png";
import NoResistanceTextAlt from "../../assets/ex/Symbols/resistance_n_d.png";

import ResistanceText from "../../assets/ex/Symbols/resistance.png";
import ResistanceTextAlt from "../../assets/ex/Symbols/resistance_d.png";
import {isNullOrEmpty} from "../../helpers/stringhelper";

export class WeaknessAndResistanceDrawer extends AbstractElementDrawer{
    private energySymbolLoader: ExEnergySymbolLoader;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
        this.energySymbolLoader = ExEnergySymbolLoader.getInstance();
    }

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(pokemonEx.weaknesses.length > 0){
            const weaknessWrapper = $("<div class='card-element poke-weakness-wrapper'></div>")
            for (const weakness of pokemonEx.weaknesses){
                if(isNullOrEmpty(weakness)) continue;
                const symbol = $(this.energySymbolLoader.getSymbolImage(weakness!)).clone();
                symbol.appendTo(weaknessWrapper);
            }
            weaknessWrapper.setElementPosition(940, 113, null, null).appendTo(this.root);
        }

        if(pokemonEx.resistances.length > 0){
            const resistanceWrapper = $("<div class='card-element poke-resistance-wrapper'></div>")
            for (const resistance of pokemonEx.resistances){
                if(isNullOrEmpty(resistance)) continue;
                const symbol = $(this.energySymbolLoader.getSymbolImage(resistance!)).clone();
                symbol.appendTo(resistanceWrapper);
            }
            resistanceWrapper.setElementPosition(940, 320, null, null).appendTo(this.root);

            const weaknessText = $(`<img class="card-element poke-resistance" src='${!this.mustInvert() ? ResistanceText : ResistanceTextAlt}'/>`);
            weaknessText.setElementPosition(921, 306, null, null).appendTo(this.root);
        }
        else{
            const weaknessText = $(`<img class="card-element poke-resistance" src='${!this.mustInvert() ? NoResistanceText : NoResistanceTextAlt}'/>`);
            weaknessText.setElementPosition(921, 319, null, null).appendTo(this.root);
        }
    }

    private mustInvert(): boolean{
        const pokemonEx = this.pokemon as IPokemonEx;
        return this.PokemonIsOfType(Type.Dark) || this.PokemonIsOfType(Type.Dragon) || pokemonEx.subFlags.isDark;
    }
}
