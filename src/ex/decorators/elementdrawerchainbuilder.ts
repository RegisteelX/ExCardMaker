import {IElementDrawer} from "./elementdrawer";
import {DetailDrawer} from "./detaildrawer";
import {IPokemon} from "../../pokemon/pokemon";
import {RetreatCostDrawer} from "./retreatcostdrawer";
import {WeaknessAndResistanceDrawer} from "./weaknessandresistancedrawer";
import {AttackDrawer} from "./attackdrawer";
import {HPDrawer} from "./hpdrawer";
import {NameDrawer} from "./namedrawer";
import {TemplateDrawer} from "./templatedrawer";
import {AbstractElementDrawer} from "./abstractelementdrawer";
import {MainImageDrawer} from "./mainimagedrawer";
import {BorderDrawer} from "./borderdrawer";
import {TeamRocketDrawer} from "./teamrocketdrawer";
import {EvolutionDrawer} from "./evolutiondrawer";
import {HolonDrawer} from "./holondrawer";
import {DeltaDrawer} from "./deltadrawer";
import {EReaderDrawer} from "./ereaderdrawer";
import {ExDrawer} from "./exdrawer";
export class PredefinedElementDrawerChain implements IElementDrawer{

    private readonly drawers: AbstractElementDrawer[]

    constructor(pokemon: IPokemon, containerId: string) {
        this.drawers = [
            new TemplateDrawer(pokemon, containerId),
            new ExDrawer(pokemon, containerId),
            new EvolutionDrawer(pokemon, containerId),
            new DeltaDrawer(pokemon, containerId),
            new HolonDrawer(pokemon, containerId),
            new TeamRocketDrawer(pokemon, containerId),
            new NameDrawer(pokemon, containerId),
            new HPDrawer(pokemon, containerId),
            new AttackDrawer(pokemon, containerId),
            new MainImageDrawer(pokemon, containerId),
            new WeaknessAndResistanceDrawer(pokemon, containerId),
            new RetreatCostDrawer(pokemon, containerId),
            new DetailDrawer(pokemon, containerId),
            new EReaderDrawer(pokemon, containerId),
            new BorderDrawer(pokemon, containerId)
        ]

        for(let i = 0; i < this.drawers.length; ++i){
            if(i + 1 >= this.drawers.length) break;
            this.drawers[i].setNext(this.drawers[i + 1]);
        }
    }

    public async draw(): Promise<void> {
        await this.drawers[0].draw();
    }
}
