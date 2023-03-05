import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Variant} from "../variant";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {ExSymbolLoader} from "../exsymbolloader";

export class NameDrawer extends AbstractElementDrawer{

    private symbolLoader: ExSymbolLoader;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
        this.symbolLoader = new ExSymbolLoader();
    }

    public async drawElement(): Promise<void> {
        const nameRoot = $("<div class='poke-name-wrapper card-element'></div>");
        const pokemonEx = this.pokemon as IPokemonEx;

        if(pokemonEx.prefix != null){
            nameRoot.append(`<p class='poke-name-prefix'>${pokemonEx.prefix}</p>`);
        }

        nameRoot.append(`<p class='poke-name'>${this.pokemon.name}</p>`);

        if(pokemonEx.variant != Variant.STANDARD){
            const wrapper = $("<div class='poke-name-variant-wrapper'></div>")
            const symbol = $(this.symbolLoader.loadSymbol(pokemonEx.variant));
            wrapper.append(symbol);
            nameRoot.append(wrapper);
        }

        nameRoot.setElementPosition(50, 60, null, null)
            .applyStyleIf("color", "#FFFFFF", () =>{
                return (this.pokemon as IPokemonEx).isDark;
            })
            .appendTo(this.root);
    }

}
