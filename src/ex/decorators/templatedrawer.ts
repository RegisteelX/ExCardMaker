import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Variant} from "../variant";
import {ExEnergySymbolLoader} from "../exenergysymbolloader";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {ExCardImageLoader} from "../excardimageloader";

export class TemplateDrawer extends AbstractElementDrawer{

    private cardTemplate = new Image();

    private energySymbolLoader: ExEnergySymbolLoader;

    private cardImageLoader: ExCardImageLoader;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
        this.energySymbolLoader = ExEnergySymbolLoader.getInstance();
        this.cardImageLoader = new ExCardImageLoader();
    }

    public async drawElement(): Promise<void> {
        await this.energySymbolLoader.loadEnergySymbols();

        const pokemonEx = (this.pokemon as IPokemonEx);
        return new Promise((resolve, reject) => {
            switch (pokemonEx.variant){
                case Variant.EX: //ExDrawer
                case Variant.EX_SHATTERED: //ExDrawer
                case Variant.STANDARD:
                    if(pokemonEx.isDark){
                        this.cardTemplate.src = this.cardImageLoader.getDarkImageSrc(this.pokemon.type);
                        break;
                    }

                    if(pokemonEx.isEReader){
                        this.cardTemplate.src = this.cardImageLoader.getEReaderImageSrc(this.pokemon.type, false);
                        break;
                    }

                    this.cardTemplate.src = this.cardImageLoader.getImageSrc(this.pokemon.type);
                    break;
                case Variant.DUAL:
                    this.cardTemplate.src = this.cardImageLoader.getDualImageSrc(this.pokemon.type, pokemonEx.dualType!);
                    break;
                case Variant.GOLDSTAR:
                    this.cardTemplate.src = this.cardImageLoader.getShiningImageSrc(this.pokemon.type, pokemonEx.isDeltaSpecies);
                    break;
            }
            this.cardTemplate.onload = () => {
                this.root.append(this.cardTemplate);
                resolve();
            };
            this.cardTemplate.onerror = () => {
                reject(new Error('Error loading card template'));
            };
        });
    }
}
