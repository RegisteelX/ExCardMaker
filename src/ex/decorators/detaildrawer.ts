import {AbstractElementDrawer} from "./abstractelementdrawer";
import {Type} from "../../pokemon/type";
import {Rarity} from "../../pokemon/carddetails";
import CommonAlt from "../../assets/ex/Symbols/common_d.png";
import Common from "../../assets/ex/Symbols/common.png";
import UncommonAlt from "../../assets/ex/Symbols/uncommon_d.png";
import Uncommon from "../../assets/ex/Symbols/uncommon.png";
import RareAlt from "../../assets/ex/Symbols/rare_d.png";
import Rare from "../../assets/ex/Symbols/rare.png";
import Ultra from "../../assets/ex/Symbols/ultra.png";
import {IPokemonEx} from "../pokemonex";

export class DetailDrawer extends AbstractElementDrawer{

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(this.pokemon.details != null){
            const details = this.pokemon.details;

            if(details.illustrator != null){
                const illustrator = $(`<div class='poke-illustrator card-element'>Illus. ${details.illustrator}</div>`)
                illustrator.setElementPosition(485, null, 79, null)
                    .appendTo(this.root);
            }

            if(details.serialNumber != null){
                const serialNumber = $(`<div class='poke-serial-number card-element'>${details.serialNumber}</div>`)
                serialNumber
                    .setElementPosition(null, 59, null, 35)
                    .applyStyleIf("color", "#FFF", (): boolean => {
                        return this.PokemonIsOfType(Type.Dark) || pokemonEx.isDark;
                    })
                    .appendTo(this.root);
            }

            if(details.copyright != null){
                const copyright = $(`<div class='poke-copyright card-element'>${details.copyright}</div>`);
                copyright
                    .setElementPosition(null, 373, null, 35)
                    .applyStyleIf("color", "#FFF", (): boolean => {
                        return this.PokemonIsOfType(Type.Dark) || pokemonEx.isDark;
                    })
                    .appendTo(this.root);
            }

            if(details.cardNumber != null || details.setTotal != null){
                const cardNumber = details.cardNumber || "000";
                const setTotal = details.setTotal || "000";

                if( details.cardNumber != null
                    && details.cardNumber !== ""
                    && details.setTotal != null
                    && details.setTotal !== ""){
                    const numbering = $(`<div class='poke-set-detail card-element'>${cardNumber}/${setTotal}</div>`);
                    numbering
                        .setElementPosition(null, null, 97, 35)
                        .applyStyleIf("color", "#FFF", (): boolean => {
                            return this.PokemonIsOfType(Type.Dark) || pokemonEx.isDark;
                        })
                        .appendTo(this.root);
                }
                else if(details.cardNumber != null && details.cardNumber != ""){
                    const numbering = $(`<div class='poke-set-detail card-element'>${cardNumber}</div>`);
                    numbering
                        .setElementPosition(null, null, 97, 35)
                        .css("width", "initial")
                        .applyStyleIf("color", "#FFF", (): boolean => {
                            return this.PokemonIsOfType(Type.Dark) || pokemonEx.isDark;
                        })
                        .appendTo(this.root);
                }
            }

            if(details.rarity != null){
                const rarity = $(`<div class='poke-rarity-wrapper card-element'></div>`);

                let image: string;
                const mustInvert = this.PokemonIsOfType(Type.Dark) || pokemonEx.isDark;
                switch (details.rarity){
                    case Rarity.COMMON:
                        image = mustInvert ? CommonAlt : Common;
                        break;
                    case Rarity.UNCOMMON:
                        image = mustInvert ? UncommonAlt : Uncommon;
                        break;
                    case Rarity.RARE:
                        image = mustInvert ? RareAlt : Rare;
                        break;
                    case Rarity.ULTRA:
                        image = Ultra;
                        break;
                }

                rarity.append(`<div class='poke-rarity'><img src='${image}'/></div>`);
                rarity
                    .setElementPosition(null, null, 81, 40)
                    .appendTo(this.root);
            }

            if(details.icon != null){
                const icon = $(`<div class='poke-icon card-element'><img src='${details.icon}'/></div>`);
                icon.setElementPosition(null, null, 41, 39).appendTo(this.root);
            }
        }
    }

}
