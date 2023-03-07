import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Type} from "../../pokemon/type";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {ExEnergySymbolLoader} from "../exenergysymbolloader";

export class RetreatCostDrawer extends AbstractElementDrawer{
    private energySymbolLoader: ExEnergySymbolLoader;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
        this.energySymbolLoader = ExEnergySymbolLoader.getInstance();
    }

    public async drawElement(): Promise<void> {
        if((this.pokemon as IPokemonEx).retreat > 0){
            const retreatWrapper = $("<div class='card-element poke-retreat-wrapper'></div>")
            for (let i = 0; i < this.pokemon.retreat; ++i){
                const symbol = $(this.energySymbolLoader.getSymbolImage(Type.Colorless)).clone();
                symbol.appendTo(retreatWrapper);
            }
            retreatWrapper.setElementPosition(940, 485, null, null).appendTo(this.root);
        }
    }

}
