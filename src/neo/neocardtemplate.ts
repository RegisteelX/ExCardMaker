import "../style/neo_style.scss"

import "../helpers/jqueryhelper"

import {CardTemplate} from "../pokemon/cardtemplate";
import {IPokemon} from "../pokemon/pokemon";
import {NeoEnergySymbolLoader, SymbolSize} from "./neoenergysymbolloader";
import {Type} from "../pokemon/type";
import {IStringReplacer} from "../helpers/stringreplacer";
import {NeoEnergySymbolReplacer} from "./neoenergysymbolreplacer";
import {NeoCardImageLoader} from "./neocardimageloader";

export class NeoCardTemplate extends CardTemplate {
    private cardTemplate = new Image();

    private energySymbolLoader: NeoEnergySymbolLoader;

    private neoCardImageLoader: NeoCardImageLoader;

    private readonly stringReplacers: IStringReplacer[];

    constructor(containerId: string, pokemon: IPokemon) {
        super(containerId, pokemon);
        this.energySymbolLoader = NeoEnergySymbolLoader.getInstance();
        this.neoCardImageLoader = new NeoCardImageLoader();

        this.stringReplacers = [
            new NeoEnergySymbolReplacer()
        ];
    }

    public async drawTemplate(): Promise<void> {
        await this.energySymbolLoader.loadEnergySymbols();
        return new Promise((resolve, reject) => {
            this.cardTemplate.src = this.neoCardImageLoader.getImageSrc(this.pokemon.type);
            this.cardTemplate.onload = () => {
                this.root.append(this.cardTemplate);
                resolve();
            };
            this.cardTemplate.onerror = () => {
                reject(new Error('Error loading card template'));
            };
        });
    }

    public drawAttacks(): void {
        const attacksRoot = $("<div class='poke-attacks card-element'></div>");

        for(let attack of this.pokemon.attacks){
            const attackRoot = $("<div class='poke-attack card-element'></div>");
            const costRoot = $(`<div class='poke-attack-costs poke-attack-costs-${attack.energyCost.length}'></div>`);
            for(let cost of attack.energyCost){
                if(cost != null){
                    const symbol = this.energySymbolLoader.getSymbolImage(cost, SymbolSize.LARGE);
                    $(symbol).appendTo(costRoot);
                }
            }

            const costWrapper = $("<div class='poke-attack-costs-wrapper'></div>");
            costRoot.appendTo(costWrapper);

            const attackDescription = $("<div class='poke-attack-description'></div>");
            if(attack.text == null){
                attackDescription.append(`<p class="poke-attack-text">
                                            <span class="poke-attack-title">${attack.name.replace(/\s+/g, "&nbsp;&nbsp;")}</span>
                                         </p>`);
                attackDescription.addClass("poke-attack-description-no-text")
            }
            else{
                let attackText = attack.text;
                for(let replacer of this.stringReplacers){
                    attackText = replacer.replace(attackText);
                }

                const attackDiv = $(`
                        <p class="poke-attack-text">
                            <span class="poke-attack-title">${attack.name.replace(/\s+/g, "&nbsp;&nbsp;")}</span>
                        ${attackText}</p>`);
                attackDescription.append(attackDiv);
            }

            const attackDamage = $("<div class='poke-attack-damage'></div>");
            if(attack.damage != null){
                attackDamage.append(`<p>${attack.damage}</p>`);
            }

            costWrapper.appendTo(attackRoot);
            attackDescription.appendTo(attackRoot);
            attackDamage.appendTo(attackRoot);
            attackRoot.appendTo(attacksRoot);
        }

        attacksRoot.setElementPosition(373, 28, null, null).appendTo(this.root);

        if(this.pokemon.attacks.length <= 1 && this.pokemon.attacks[0]?.text == null) return;
        this.fixFontSizes();
    }

    private fixFontSizes(): void {
        const maxHeight = this.pokemon.attacks.length > 1 ? 164 : 142;
        const minFont = 1;
        const maxFont = 22;

        const container = $(".poke-attacks");
        const divs = $('.poke-attack-text');

        let avgCharsPerLine = 0;
        divs.each((index, div) => {
            avgCharsPerLine += $(div).text().length / $(div).height()!;
        });
        avgCharsPerLine = avgCharsPerLine / divs.length;

        let fontSize = maxHeight / avgCharsPerLine;
        fontSize = Math.min(maxFont, fontSize);
        fontSize = Math.max(minFont, fontSize);

        const sorted = divs.toArray().sort(function (a, b) {
            return $(a).text().length > $(b).text().length ? 1 : -1;
        });

        while (true) {
            let totalHeight = 0;
            sorted.forEach((div) => {
                $(div).css({
                    'font-size': `${fontSize}px`,
                    'line-height': `${fontSize + 2}px`
                });
                const attackTitle = $(div).find('.poke-attack-title');
                if (attackTitle.length) {
                    attackTitle.css('font-size', `${fontSize + 4}px`);
                }
                totalHeight += $(div).height()!;
            });
            if (container.height()! <= maxHeight || fontSize <= minFont) {
                break;
            }
            fontSize -= 2;
        }

        $(".poke-energy-symbol-span").each((index, elem) => {
            $(elem).css("top", `${fontSize * 0.15}px`);
            $(elem).parent().css(`margin`, `0 ${fontSize / 10}px`)
        });

        container.height(164);
    }

    public drawHP(): void {
        $(`<p class='poke-hp card-element'>${this.pokemon.hp} HP</p>`).setElementPosition(46, null, 81, null).appendTo(this.root);
    }

    public drawName(): void {
        $(`<p class='poke-name card-element'>${this.pokemon.name}</p>`).setElementPosition(41, 45, null, null).appendTo(this.root);
    }

    public drawWeaknessAndResistance(): void {
        if(this.pokemon.weakness != null){
            const symbol = this.energySymbolLoader.getSymbolImage(this.pokemon.weakness, SymbolSize.MEDIUM);
            $(symbol).setElementPosition(557, 60, null, null).appendTo(this.root);
        }

        if(this.pokemon.resistance != null) {
            const symbol = this.energySymbolLoader.getSymbolImage(this.pokemon.resistance, SymbolSize.MEDIUM);
            $(symbol).setElementPosition(557, 218, null, null).appendTo(this.root);
            $("<p class='poke-weakness card-element'>-30</p>").setElementPosition(558, 256, null, null).appendTo(this.root);
        }
    }

    public drawRetreatCost(): void{
        const elem = $("<div class='poke-retreat card-element'></div>");
        for(let i = 0; i < this.pokemon.retreat; ++i){
            const symbol = this.energySymbolLoader.getSymbolImage(Type.Colorless, SymbolSize.MEDIUM);
            elem.append(symbol);
        }

        const x = this.pokemon.retreat === 4 ? 328 : 376 - ((24 * this.pokemon.retreat) / 2) + 12
        elem.setElementPosition(557, x, null, null).appendTo(this.root);
    }

    public drawDetails(): void{

    }
}
