import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Type} from "../../pokemon/type";
import {LegacyAbilityType} from "../../pokemon/ability";
import {Variant} from "../variant";
import {IPokemon} from "../../pokemon/pokemon";
import {IElementDrawer} from "./elementdrawer";
import {Coordinate} from "../../helpers/jqueryhelper";
import {IStringReplacer} from "../../helpers/stringreplacer";
import {ExEnergySymbolLoader} from "../exenergysymbolloader";
import {ExSymbolLoader} from "../exsymbolloader";
import {ExPokemonReplacer} from "../replacers/expokemonreplacer";
import {ExEnergySymbolReplacer} from "../replacers/exenergysymbolreplacer";
import {TextSymbolReplacer} from "../replacers/textsymbolreplacer";
import {ItalicTextReplacer} from "../replacers/italictextreplacer";
import {doDivsOverlap} from "../../helpers/elementhelper";
import {IsEvolved} from "../../pokemon/evolution";

import PokePower from "../../assets/ex/Symbols/power.png";
import PokeBody from "../../assets/ex/Symbols/body.png";

export class AttackDrawer extends AbstractElementDrawer{

    private readonly AMOUNT_OF_SLOTS: number = 9;
    private readonly SLOT_GAP_INITIAL: number = 12;
    private readonly SLAT_GAP_REDUCED: number = 6;
    private readonly SLOT_GAP_NONE: number = 0;
    private readonly MAX_INNER_HEIGHT = 910;
    private readonly INITIAL_DESCRIPTION_FONT_SIZE = 32;
    private readonly MIN_FONT_SIZE = 20;

    private descriptionFontSize: number;

    private rescaling: boolean;

    private slotGapPixels: number;

    private readonly slots: Coordinate[];

    private readonly stringReplacers: IStringReplacer[];

    private energySymbolLoader: ExEnergySymbolLoader;

    private symbolLoader: ExSymbolLoader;

    public constructor(pokemon: IPokemon, containerId: string, elementDrawer: IElementDrawer | null = null) {
        super(pokemon, containerId, elementDrawer);
        this.energySymbolLoader = ExEnergySymbolLoader.getInstance();
        this.symbolLoader = new ExSymbolLoader();

        this.slotGapPixels = this.SLOT_GAP_INITIAL;
        this.descriptionFontSize = this.INITIAL_DESCRIPTION_FONT_SIZE;
        this.rescaling = false;

        this.stringReplacers = [
            new ExPokemonReplacer(),
            new ExEnergySymbolReplacer(),
            new TextSymbolReplacer(),
            new ItalicTextReplacer()
        ];

        this.slots = this.createSlots();
    }

    public async drawElement(): Promise<void> {
        if((this.pokemon as IPokemonEx).ability != undefined){
            this.drawAbility();
        }

        this.drawAttacks();
    }

    private drawAttacks(): void{
        if(this.pokemon.attacks.length === 0){
            return;
        }

        const startX = 50;
        const attacks = this.pokemon.attacks.sort((a, b) => a.energyCost.length - b.energyCost.length);
        const pokemonEx = this.pokemon as IPokemonEx;

        let startSlot = this.getStartingSlot();
        for (let attack of attacks){
            const attackWrapper = $("<div class='poke-attack-wrapper card-element'></div>")
            const attackRoot = $("<div class='poke-attack'></div>");
            const costRoot = $(`<div class='poke-attack-costs poke-attack-costs-${attack.energyCost.length}'></div>`);
            const costWrapper = $("<div class='poke-attack-costs-wrapper'></div>");

            const costs: Type[] = attack.energyCost.sortEnumValuesByFrequencyWithExclusion(Type.Colorless);
            for(let cost of costs){
                if(cost != null){
                    const symbol = $(this.energySymbolLoader.getSymbolImage(cost)).clone();
                    $(symbol).appendTo(costRoot);
                }
            }

            costRoot.appendTo(costWrapper);
            costWrapper.appendTo(attackRoot);

            $(`<div class='poke-attack-name'>${attack.name}</div>`)
                .applyStyleIf("margin-left", "65px", (): boolean => {
                    return attack.energyCost.length < 3;
                })
                .applyStyleIf("color", "#FFFFFF", () => {
                    return pokemonEx.isDark;
                })
                .appendTo(attackRoot);

            if(attack.damage != null){
                const splitAttackValue = this.splitAttackValue(attack.damage as string);
                if(splitAttackValue != null){
                    const attackWrapper = $("<div class='poke-attack-damage-wrapper'></div>")
                    const attackDamage = $(`<div class='poke-attack-damage'>${splitAttackValue.value}</div>`);
                    attackDamage
                        .applyStyleIf("color", "#FFFFFF", () => {
                            return pokemonEx.isDark;
                        })
                        .appendTo(attackWrapper);

                    if(splitAttackValue.postfix != null){
                        const attackPostfix = $(`<div class='poke-attack-damage-postfix'>${splitAttackValue.postfix}</div>`);
                        attackPostfix.appendTo(attackWrapper);
                    }
                    else{
                        $("<div class='poke-attack-damage-postfix-placeholder'></div>").appendTo(attackWrapper);
                    }

                    attackWrapper
                        .applyStyleIf("margin-right", "42px", (): boolean => {
                            return attack.energyCost.length === 1;
                        })
                        .appendTo(attackRoot);
                }
            }

            if(attack.text != null){
                let text = attack.text;
                for(let replacer of this.stringReplacers){
                    text = replacer.replace(text);
                }

                const attackDescription = $(`<div class='poke-attack-description'>${text}</div>`);
                attackDescription
                    .css("font-size", `${this.descriptionFontSize}px`)
                    .css("line-height", `${this.descriptionFontSize + 1}px`)
                    .applyStyleIf("margin-left", "42px", (): boolean => {
                        return attack.energyCost.length == 1;
                    })
                    .applyStyleIf("color", "#FFFFFF", () => {
                        return pokemonEx.isDark;
                    })
                    .appendTo(attackWrapper);
            }

            let calcX = startX;
            if(attack.energyCost.length == 1){
                calcX += 42;
            }

            attackRoot.appendTo(attackWrapper);
            attackWrapper.setElementPosition(this.slots[startSlot].y, calcX, null, null).appendTo(this.root);
            startSlot = this.findNextFittingSlot(startSlot, attackWrapper.height()!);
        }

        if(!this.rescaling){
            this.checkIfTextFits();
        }
    }

    private drawAbility(): void {
        const abilityImage = (this.pokemon as IPokemonEx).ability!.type === LegacyAbilityType.POWER ? PokePower : PokeBody;
        const abilityInner = (this.pokemon as IPokemonEx).ability!.inner;

        const ability = $("<div class='poke-ability card-element'></div>");
        const abilityName = $(`<div class='poke-ability-name'><img src='${abilityImage}'/><p class="${(this.pokemon as IPokemonEx).ability!.type}">${abilityInner.name}</p></div>`);

        const pokemonEx = this.pokemon as IPokemonEx;
        let position = this.slots[0];
        if(pokemonEx.variant != Variant.STANDARD || IsEvolved(pokemonEx) || pokemonEx.isDeltaSpecies || pokemonEx.isDark){
            position = this.slots[1];
        }

        ability.setElementPosition(position.y - 3, 91, null, null);

        let text = abilityInner.description;
        for(let replacer of this.stringReplacers){
            text = replacer.replace(text);
        }

        const abilityDescription = $(`<div class="poke-ability-description">${text}</div>`);
        abilityDescription
            .css("font-size", `${this.descriptionFontSize}px`)
            .css("line-height", `${this.descriptionFontSize + 1}px`)
            .applyStyleIf("color", "#FFFFFF", () => {
                return pokemonEx.isDark;
            });

        abilityName.appendTo(ability);
        abilityDescription.appendTo(ability);
        ability.appendTo(this.root);
    }

    private splitAttackValue(attackValue: string): { value: number, postfix: string | undefined } | undefined {
        const pattern = /^(\d+)(\D*)$/;
        const match = pattern.exec(attackValue);
        if (!match) {
            return undefined;
        }
        const value = parseInt(match[1], 10);
        const postfix = match[2] || undefined;
        return { value, postfix };
    }

    private getRelativePosition(child: JQuery<HTMLElement>, parent: JQuery<HTMLElement>): Coordinate {
        const childOffset = child.offset()!;
        const parentOffset = parent.offset()!;
        return {
            x: childOffset.left - parentOffset.left,
            y: childOffset.top - parentOffset.top
        };
    }

    private checkIfTextFits(){
        let height = this.getHighestAttackHeight();
        let noOverlap = this.noAttacksOverlap();
        this.rescaling = (height > this.MAX_INNER_HEIGHT) || !noOverlap;

        while(height > this.MAX_INNER_HEIGHT || !noOverlap){
            height = this.getHighestAttackHeight();

            this.clearElements();
            this.redrawElements();

            noOverlap = this.noAttacksOverlap();
            if(!noOverlap && this.reduceGapSize() || height > this.MAX_INNER_HEIGHT && this.reduceGapSize()){
                continue;
            }

            this.descriptionFontSize -= 1;
            if(this.descriptionFontSize <= this.MIN_FONT_SIZE) break;
        }

        let tryIncreaseFontSize = true;
        while(tryIncreaseFontSize){
            this.descriptionFontSize += 1;
            if(this.descriptionFontSize >= this.INITIAL_DESCRIPTION_FONT_SIZE) break;

            this.clearElements();
            this.redrawElements();

            height = this.getHighestAttackHeight();
            noOverlap = this.noAttacksOverlap();

            if(height > this.MAX_INNER_HEIGHT || !noOverlap){
                this.descriptionFontSize -= 1;
                this.clearElements();
                this.redrawElements();
                tryIncreaseFontSize = false;
            }
        }
    }

    private getHighestAttackHeight(): number{
        const card = $("#card");
        const pokemonEx = this.pokemon as IPokemonEx;
        let highest = 0;

        if(pokemonEx.ability != null){
            const ability = $(".poke-ability");
            const relativePosition = this.getRelativePosition(ability, card);
            highest = relativePosition.y + ability.height()!;
        }

        const attacks = card.find(".poke-attack-wrapper");
        for(let i = 0; i < attacks.length; ++i){
            const attack = $(attacks[i]);
            const topPosition = parseInt(attack.css("top"), 10);
            let height = topPosition + attack.height()!;

            if(height > highest){
                highest = height;
            }
        }

        return highest;
    }

    private reduceGapSize(): boolean{
        if(this.slotGapPixels === this.SLOT_GAP_INITIAL){
            this.slotGapPixels = this.SLAT_GAP_REDUCED;
            return true;
        }

        if(this.slotGapPixels === this.SLAT_GAP_REDUCED){
            this.slotGapPixels = this.SLOT_GAP_NONE;
            return true;
        }

        return false;
    }

    private noAttacksOverlap(): boolean{
        const pokemonEx = this.pokemon as IPokemonEx;
        if(this.SingleAttack() && pokemonEx.ability == null) return true;

        const ability = $(".poke-ability");
        const attacks = $("#card").find(".poke-attack-wrapper");

        if(ability.length > 0 && attacks.length > 0 && doDivsOverlap(ability, $(attacks[0]))){
            return false;
        }

        for(let i = 0; i < attacks.length; ++i){
            if(i + 1 >= attacks.length) break;

            const attackOne = $(attacks[0]);
            const attackTwo = $(attacks[1]);

            if(doDivsOverlap(attackOne, attackTwo)){
                return false;
            }
        }

        return true;
    }

    private clearElements(){
        $(".poke-ability").remove();
        $(".poke-attack-wrapper").remove();
    }

    private async redrawElements(): Promise<void>{
        await this.drawElement();
    }

    private createSlots(): Coordinate[]{
        const slots: Coordinate[] = [];

        let startY = 534 //First slot starts at this height;
        for(let i = 0; i < this.AMOUNT_OF_SLOTS; ++i){
            slots.push({ x: 0, y: startY });
            startY += 41;
        }

        return slots;
    }

    private findNextFittingSlot(startSlot: number, height: number): number {
        height += this.slotGapPixels;

        for (let i = startSlot + 1; i < this.slots.length - 1; i++) {
            if (this.slots[startSlot].y + height < this.slots[i].y) {
                return i;
            }
        }

        return this.slots.length - 1;
    }

    private getStartingSlot(): number {
        const pokemonEx = this.pokemon as IPokemonEx;
        const ability = pokemonEx.ability;
        const variant = pokemonEx.variant;

        //Holon has special rules.
        if(pokemonEx.holon != null){
            return 2;
        }

        if (ability != null) {
            const slot = variant !== Variant.STANDARD || IsEvolved(pokemonEx) || pokemonEx.isDeltaSpecies || pokemonEx.isDark ? 1 : 0;
            let height = $(".poke-ability").height()!;

            /*if(!this.rescaling && this.SingleAttackWithoutDescription() || !this.rescaling && this.SingleAttack() && height <= 143){
                return this.findNextFittingSlot(slot, height);
            }*/

            return this.findNextFittingSlot(slot, height);
        }

        if (this.pokemon.attacks.length <= 1) {
            if(this.SingleAttackWithoutDescription()){
                return 4;
            }
            return 3;
        }

        return !this.rescaling ? 2 : 1;
    }

    private SingleAttack(): boolean{
        return this.pokemon.attacks.length === 1;
    }

    private SingleAttackWithoutDescription(): boolean{
        return this.SingleAttack() && this.pokemon.attacks[0].text == null || this.pokemon.attacks.length === 0;
    }
}
