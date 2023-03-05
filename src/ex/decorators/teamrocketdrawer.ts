import {AbstractElementDrawer} from "./abstractelementdrawer";
import {ExEnergySymbolLoader} from "../exenergysymbolloader";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {IPokemonEx} from "../pokemonex";

import TeamRocketSymbol from "../../assets/ex/Symbols/rocket.png";
import TeamRocketBorder from "../../assets/ex/Borders/rocket.png";

export class TeamRocketDrawer extends AbstractElementDrawer{
    private energySymbolLoader: ExEnergySymbolLoader;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
        this.energySymbolLoader = ExEnergySymbolLoader.getInstance();
    }

    public async drawElement(): Promise<void> {
        if((this.pokemon as IPokemonEx).isTeamRocket){
            const rocketSymbol = $(`<img src='${TeamRocketSymbol}' class='card-element'>`)
            rocketSymbol.setElementPosition(null, null, 60, 86).appendTo(this.root);

            const rocketBorder = $(`<img src='${TeamRocketBorder}' class='card-element'>`)
            rocketBorder.setElementPosition(48, 39, null, null).appendTo(this.root);
        }
    }

}
