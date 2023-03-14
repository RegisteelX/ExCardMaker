import {IElementDrawer} from "./elementdrawer";
import {IPokemon} from "../../pokemon/pokemon";
import {Type} from "../../pokemon/type";
import {IPokemonEx} from "../pokemonex";

import "../../helpers/jqueryhelper"
import "../../helpers/arrayhelper"
import {Variant} from "../variant";

export abstract class AbstractElementDrawer implements IElementDrawer{

    protected root: HTMLElement;

    private next: IElementDrawer | null;

    protected pokemon: IPokemon;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        this.pokemon = pokemon;
        this.root = document.getElementById(containerId) as HTMLElement;
        this.next = elementDrawer;
    }

    public setNext(elementDrawer: IElementDrawer): void{
        this.next = elementDrawer;
    }

    public async draw(): Promise<void>{
        await this.drawElement();
        if(this.next){
            await this.next.draw();
        }
    }

    public abstract async drawElement(): Promise<void>;

    protected PokemonIsDualType(): boolean{
        return (this.pokemon as IPokemonEx).variant == Variant.DUAL;
    }

    protected PokemonIsOfType(type: Type): boolean{
        return this.pokemon.type === type || (this.pokemon as IPokemonEx).dualType === type;
    }
}
