import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";

export class EReaderDrawer extends AbstractElementDrawer{

    private readonly E_READER_OFFSET: number = 30;
    private readonly E_READER_OFFSET_DETAILS: number = 39;
    private readonly E_READER_OFFSET_SERIAL_NUMBER: number = 63;
    private readonly E_READER_OFFSET_ICON_Y: number = 60;
    private readonly E_READER_OFFSET_ICON_X: number = -10;
    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(pokemonEx.subFlags.isEReader){
            if(pokemonEx.weaknesses.length > 0){
                $(".poke-weakness-wrapper")
                    .increasePosition("top", this.E_READER_OFFSET + 4);
            }

            $(".poke-resistance")
                .increasePosition("top", this.E_READER_OFFSET);
            if(pokemonEx.resistances.length > 0){
                $(".poke-resistance-wrapper")
                    .increasePosition("top", this.E_READER_OFFSET + 4);
            }

            if(pokemonEx.retreat > 0){
                $(".poke-retreat-wrapper")
                    .increasePosition("top", this.E_READER_OFFSET + 4);
            }

            $(".poke-serial-number")
                .increasePosition("bottom", this.E_READER_OFFSET_DETAILS)
                .increasePosition("left", this.E_READER_OFFSET_SERIAL_NUMBER);

            $(".poke-copyright")
                .increasePosition("bottom", this.E_READER_OFFSET_DETAILS);
            $(".poke-set-detail")
                .increasePosition("bottom", this.E_READER_OFFSET_DETAILS);
            $(".poke-rarity-wrapper")
                .increasePosition("bottom", this.E_READER_OFFSET_DETAILS + 2);

            $(".poke-icon")
                .increasePosition("bottom", this.E_READER_OFFSET_ICON_Y)
                .increasePosition("right", this.E_READER_OFFSET_ICON_X);
        }
    }

}
