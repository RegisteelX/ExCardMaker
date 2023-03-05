import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {StageType} from "../../pokemon/stage";

import EvolutionCircle from "../../assets/ex/Borders/evo_circle.png";
import Stage1Elements from "../../assets/ex/Borders/stage1.png";
import Stage2Elements from "../../assets/ex/Borders/stage2.png";
import {IPokemonEx} from "../pokemonex";
import {Variant} from "../variant";
import {IEvolutionStage, IsEvolved} from "../../pokemon/evolution";

export class EvolutionDrawer extends AbstractElementDrawer{

    private readonly EVOLUTION_TEXT: string = "Evolves from ";
    private readonly EVOLUTION_TEXT_SPECIAL: string = "Evolves from</br>";

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
    }

    public async drawElement(): Promise<void> {
        const pokemonEx = this.pokemon as IPokemonEx;
        if(!IsEvolved(pokemonEx)) return;

        const evolution = this.pokemon.evolution!;
        let elements: string;
        switch (evolution.stage){
            case StageType.STAGE1:
                elements = Stage1Elements;
                break;
            case StageType.STAGE2:
                elements = Stage2Elements;
                break;
        }

        const evolutionBorder = $(`<img src='${elements!}' class='card-element'>`)
        evolutionBorder
            .setElementPosition(29, 32, null, null)
            .applyStyleIf("left", 30, (): boolean => {
                return pokemonEx.evolution!.stage == StageType.STAGE2
            })
            .appendTo(this.root);

        const evolutionCircle = $(`<img src='${EvolutionCircle}' class='card-element poke-evolution-circle'>`)
        evolutionCircle.setElementPosition(457, 29, null, null).appendTo(this.root);

        const pokemonIsSpecialVariant = pokemonEx.variant != Variant.STANDARD;
        const innerText = pokemonIsSpecialVariant ?
                                    this.EVOLUTION_TEXT_SPECIAL + evolution.evolvesFrom :
                                    this.EVOLUTION_TEXT + evolution.evolvesFrom;

        const evolutionText = $(`<div class='card-element poke-evolution-text'><p>${innerText}</p></div>`);
        evolutionText.setElementPosition(511, 247, null, null).appendTo(this.root);

        await this.drawPreviousPokemonInCircle(evolution);
    }

    private async drawPreviousPokemonInCircle(evolutionStage: IEvolutionStage): Promise<void>{
        const canvas = document.createElement('canvas');
        canvas.width = 90;
        canvas.height = 82;

        const ctx = canvas.getContext('2d')!;

        const radius = canvas.width / 2;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();

        const centerImage = new Image();
        centerImage.crossOrigin = 'anonymous';
        centerImage.src = evolutionStage.image;
        centerImage.onload = () => {
            const imageSize = Math.min(canvas.width, canvas.height);
            const x = (canvas.width - imageSize) / 2;
            const y = (canvas.height - imageSize) / 2;

            const radius = imageSize / 2;
            const cx = x + radius;
            const cy = y + radius;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();

            ctx.drawImage(centerImage, 0, 0, canvas.width, canvas.height);

            const imageSrc = canvas.toDataURL();
            const imageElement = document.createElement('img');
            imageElement.src = imageSrc;

            $(imageElement)
                .addClass("card-element poke-evolution-image")
                .setElementPosition(464, 41, null, null)
                .appendTo(this.root);
        };
    }
}
