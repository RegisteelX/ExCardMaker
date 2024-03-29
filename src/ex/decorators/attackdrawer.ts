import {AbstractElementDrawer} from "./abstractelementdrawer";
import {IPokemonEx} from "../pokemonex";
import {Type, TypeOrder} from "../../pokemon/type";
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
import {doDivsOverlap, doDivsOverlapWithOffset} from "../../helpers/elementhelper";
import {IsEvolved} from "../../pokemon/evolution";

import PokePower from "../../assets/ex/Symbols/power.png";
import PokeBody from "../../assets/ex/Symbols/body.png";

export class AttackDrawer extends AbstractElementDrawer{

    private readonly AMOUNT_OF_SLOTS: number = 9;
    private readonly SLOT_GAP_INITIAL: number = 10;
    private readonly SLAT_GAP_REDUCED: number = 6;
    private readonly SLOT_GAP_NONE: number = 0;
    private readonly MAX_INNER_HEIGHT = 910;
    private readonly INITIAL_DESCRIPTION_FONT_SIZE = 32;
    private readonly MIN_FONT_SIZE = 16;

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

    private sortTypesByFrequencyAndOrder(types: Type[], excludedType: Type): Type[] {
        const sortedTypes = types.sortEnumValuesByFrequencyWithExclusion(excludedType);

        return sortedTypes.sort((a, b) => {
            const aIndex = TypeOrder.indexOf(a);
            const bIndex = TypeOrder.indexOf(b);

            // If both types are in the order array, sort by their position in the array.
            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            }

            // If only one type is in the order array, it should come first.
            if (aIndex !== -1) {
                return -1;
            } else if (bIndex !== -1) {
                return 1;
            }

            // If neither type is in the order array, use the previous sort order.
            return sortedTypes.indexOf(b) - sortedTypes.indexOf(a);
        });
    }

    private drawAttacks(): void{
        if(this.pokemon.attacks.length === 0){
            return;
        }

        const startX = 50;
        const attacks = this.pokemon.attacks.sort((a, b) => a.energyCost.length - b.energyCost.length);
        const pokemonEx = this.pokemon as IPokemonEx;

        let startSlot = this.getStartingSlot();
        for (const attack of attacks){
            const attackWrapper = $("<div class='poke-attack-wrapper card-element'></div>")
            const attackRoot = $("<div class='poke-attack'></div>");
            const costRoot = $(`<div class='poke-attack-costs poke-attack-costs-${attack.energyCost.length}'></div>`);
            const costWrapper = $("<div class='poke-attack-costs-wrapper'></div>");

            const costs: Type[] = this.sortTypesByFrequencyAndOrder(attack.energyCost, Type.Colorless);
            for(const cost of costs){
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
                    return pokemonEx.subFlags.isDark || this.PokemonIsOfType(Type.Dragon) && !this.PokemonIsDualType();
                })
                .appendTo(attackRoot);

            if(attack.damage != null){
                const splitAttackValue = this.splitAttackValue(attack.damage as string);
                if(splitAttackValue != null){
                    const attackWrapper = $("<div class='poke-attack-damage-wrapper'></div>")
                    const attackDamage = $(`<div class='poke-attack-damage'>${splitAttackValue.value}</div>`);
                    attackDamage
                        .applyStyleIf("color", "#FFFFFF", () => {
                            return pokemonEx.subFlags.isDark || this.PokemonIsOfType(Type.Dragon) && !this.PokemonIsDualType();
                        })
                        .appendTo(attackWrapper);

                    if(splitAttackValue.postfix != null){
                        const attackPostfix = $(`<div class='poke-attack-damage-postfix'>${splitAttackValue.postfix}</div>`);
                        attackPostfix
                            .applyStyleIf("color", "#FFFFFF", () => {
                                return pokemonEx.subFlags.isDark || this.PokemonIsOfType(Type.Dragon) && !this.PokemonIsDualType();
                            })
                            .appendTo(attackWrapper);
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
                for(const replacer of this.stringReplacers){
                    text = replacer.replace(text);
                }

                const attackDescription = $(`<div class='poke-attack-description poke-description'>${text}</div>`);
                attackDescription
                    .css("font-size", `${this.descriptionFontSize}px`)
                    .css("line-height", `${this.descriptionFontSize + 1}px`)
                    .applyStyleIf("margin-left", "42px", (): boolean => {
                        return attack.energyCost.length == 1;
                    })
                    .applyStyleIf("color", "#FFFFFF", () => {
                        return pokemonEx.subFlags.isDark || this.PokemonIsOfType(Type.Dragon) && !this.PokemonIsDualType();
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
        if(IsEvolved(pokemonEx) && pokemonEx.variant === Variant.STANDARD && !pokemonEx.subFlags.isDeltaSpecies && !pokemonEx.subFlags.isDark){
            abilityName.css("padding-left", "39px");
        }

        let position = this.slots[0];
        if(pokemonEx.variant != Variant.STANDARD || IsEvolved(pokemonEx) && !this.SLAT_GAP_REDUCED || pokemonEx.subFlags.isDeltaSpecies || pokemonEx.subFlags.isDark){
            position = this.slots[1];
        }

        ability.setElementPosition(position.y - 3, 91, null, null);

        let text = abilityInner.description;
        for(const replacer of this.stringReplacers){
            text = replacer.replace(text);
        }

        const abilityDescription = $(`<div class="poke-ability-description poke-description">${text}</div>`);
        abilityDescription
            .css("font-size", `${this.descriptionFontSize}px`)
            .css("line-height", `${this.descriptionFontSize + 1}px`)
            .applyStyleIf("color", "#FFFFFF", () => {
                return pokemonEx.subFlags.isDark || this.PokemonIsOfType(Type.Dragon) && !this.PokemonIsDualType();
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
        const pokemonEx = this.pokemon as IPokemonEx;
        let height = this.getHighestAttackHeight();
        let noOverlap = this.noAttacksOverlap();
        this.rescaling = (height > this.MAX_INNER_HEIGHT) || !noOverlap;

        let failed = false;
        let hasResized = false;

        //Reposition attacks in case they overlap or exceed the inner card.
        while(height > this.MAX_INNER_HEIGHT || !noOverlap){
            hasResized = true;
            height = this.getHighestAttackHeight();

            this.clearElements();
            this.redrawElements();

            noOverlap = this.noAttacksOverlap();
            if(!noOverlap && this.reduceGapSize() || height > this.MAX_INNER_HEIGHT && this.reduceGapSize()){
                continue;
            }

            this.descriptionFontSize -= 1;
            if(this.descriptionFontSize <= this.MIN_FONT_SIZE){
                failed = true;
                break;
            }
        }

        if(this.rescaling){
            this.clearElements();
            this.redrawElements();
        }

        let tryIncreaseFontSize = true;
        //Try increasing font size again after repositioning.
        while(tryIncreaseFontSize && !failed){
            this.descriptionFontSize += 1;
            if(this.descriptionFontSize >= this.INITIAL_DESCRIPTION_FONT_SIZE) break;

            this.changeDescriptionFontSize(this.descriptionFontSize);

            height = this.getHighestAttackHeight();
            noOverlap = this.noAttacksOverlap();

            console.log(height, noOverlap, this.descriptionFontSize);
            if(height > this.MAX_INNER_HEIGHT || !noOverlap){
                this.descriptionFontSize -= 1;
                this.changeDescriptionFontSize(this.descriptionFontSize);
                tryIncreaseFontSize = false;
            }
        }

        if(!failed){
            //Spacing rule for 2 attacks or 1 attack + ability having an extra slot separating them.
            if((pokemonEx.attacks.length == 2 && !this.hasAbility() || pokemonEx.attacks.length == 1 && this.hasAbility()) && hasResized){
                const card = $("#card");
                const attackList = card.find(".poke-attack-wrapper");
                const attack = this.hasAbility() ? $(attackList[0]): $(attackList[1]);
                const slotIndex = this.getCurrentSlot(this.getRelativePosition(attack, card).y);
                const slot = this.slots[slotIndex];

                if(slotIndex <= this.slots.length - 2){
                    const nextSlot = this.slots[slotIndex + 1];
                    attack.css("top", nextSlot.y);
                    height = this.getHighestAttackHeight();

                    if(height > this.MAX_INNER_HEIGHT){
                        attack.css("top", slot.y);
                    }
                }
            }
            return;
        }

        //Positioning rules for when pretty much all space is taken by text.
        //This is the only rule to break the slot based positioning.
        let spatialReductionAttempt = true;
        const attackList = $("#card").find(".poke-attack-wrapper");
        let index = this.hasAbility() ? 0 : 1;
        while (spatialReductionAttempt && !this.singleAttack()){
            let innerLoop = true;
            while(innerLoop){
                this.changeAttackTopPosition($(attackList[index]), -1);
                noOverlap = this.noAttacksOverlap();

                if(!noOverlap){
                    this.changeAttackTopPosition($(attackList[index]), this.SLOT_GAP_INITIAL);
                    index += 1;
                }

                if(index >= attackList.length){
                    innerLoop = false;
                }
            }

            spatialReductionAttempt = false;
        }
    }

    private changeAttackTopPosition(element: JQuery<HTMLElement>, amount: number): void{
        const top = parseInt(element.css("top"), 10);
        element.css("top", `${top + amount}px`);
    }

    private changeDescriptionFontSize(amount: number): void{
        const descriptions = $("#card").find(".poke-description");
        descriptions.each((index, element) => {
            $(element)
                .css("font-size", `${amount}px`)
                .css("line-height", `${amount + 1}px`)
        })
    }

    private getHighestAttackHeight(): number{
        const card = $("#card");
        let highest = 0;

        if(this.hasAbility()){
            const ability = $(".poke-ability");
            const relativePosition = this.getRelativePosition(ability, card);
            highest = relativePosition.y + ability.height()!;
        }

        const attacks = card.find(".poke-attack-wrapper");
        for(let i = 0; i < attacks.length; ++i){
            const attack = $(attacks[i]);
            const topPosition = parseInt(attack.css("top"), 10);
            const height = topPosition + attack.height()!;

            if(height > highest){
                highest = height;
            }
        }

        return highest;
    }

    private reduceGapSize(){
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

    private noAttacksOverlap(keepGapInMind = false): boolean{
        const pokemonEx = this.pokemon as IPokemonEx;
        if(this.singleAttack() && pokemonEx.ability == null) return true;

        const ability = $(".poke-ability");
        const attacks = $("#card").find(".poke-attack-wrapper");

        if(this.hasAbility()){
            const abilityOverlap = keepGapInMind ? doDivsOverlapWithOffset(ability, $(attacks[0]), { bottom: this.SLOT_GAP_INITIAL }) : doDivsOverlap(ability, $(attacks[0]));
            if(ability.length > 0 && attacks.length > 0 && abilityOverlap){
                return false;
            }
        }

        for(let i = 0; i < attacks.length; ++i){
            if(i + 1 >= attacks.length) break;

            const attackOne = $(attacks[i]);
            const attackTwo = $(attacks[i + 1]);

            if(keepGapInMind && doDivsOverlapWithOffset(attackOne, attackTwo, { bottom: this.SLOT_GAP_INITIAL })){
                return false;
            }
            else if(!keepGapInMind && doDivsOverlap(attackOne, attackTwo)){
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

    private getCurrentSlot(height: number): number {
        for (let i = 0; i < this.slots.length - 1; i++) {
            if (height <= this.slots[i].y) {
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
            const slot = variant !== Variant.STANDARD || IsEvolved(pokemonEx) || pokemonEx.subFlags.isDeltaSpecies || pokemonEx.subFlags.isDark ? 1 : 0;
            const height = $(".poke-ability").height()!;

            /*if(!this.rescaling && this.singleAttackWithoutDescription() || !this.rescaling && this.singleAttack() && height <= 143){
                return this.findNextFittingSlot(slot, height);
            }*/

            return this.findNextFittingSlot(slot, height);
        }

        if (this.pokemon.attacks.length <= 1) {
            if(this.singleAttackWithoutDescription()){
                return 4;
            }
            return 3;
        }

        return !this.rescaling ? 2 : 1;
    }

    private singleAttack(): boolean{
        return this.pokemon.attacks.length === 1;
    }

    private singleAttackWithoutDescription(): boolean{
        return this.singleAttack() && this.pokemon.attacks[0].text == null || this.pokemon.attacks.length === 0;
    }

    private hasAbility(): boolean{
        return (this.pokemon as IPokemonEx).ability != null;
    }
}
