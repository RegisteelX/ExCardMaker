import {IPokemonBuilder} from "../pokemon/pokemonbuilder";
import {IPokemon} from "../pokemon/pokemon";
import {IPokemonEx} from "./pokemonex";
import {Type} from "../pokemon/type";
import {Variant} from "./variant";
import {IAbility, LegacyAbilityType} from "../pokemon/ability";
import {ICardDetails} from "../pokemon/carddetails";
import {IAttack} from "../pokemon/attack";
import {IEvolutionStage} from "../pokemon/evolution";

export class PokemonExBuilder implements IPokemonBuilder{
    private pokemon: IPokemonEx = {
        name: '',
        type: Type.Colorless,
        hp: 0,
        attacks: [],
        retreat: 0,
        variant: Variant.STANDARD,
        weaknesses: [],
        resistances: [],
        subFlags: {
            isDark: false,
            isTeamRocket: false,
            isDeltaSpecies: false,
            isEReader: false,
            isCrystal: false
        }
    };

    constructor(name: string){
        this.pokemon.name = name;
    }

    public setType(type: Type): PokemonExBuilder{
        this.pokemon.type = type;
        return this;
    }

    public setHp(hp: number): PokemonExBuilder{
        this.pokemon.hp = hp;
        return this;
    }

    public setEvolution(evolution: IEvolutionStage): PokemonExBuilder{
        if(this.pokemon.variant == Variant.GOLDSTAR) return this;
        this.pokemon.evolution = evolution;
        return this;
    }

    public addAttack(attack: IAttack): PokemonExBuilder{
        this.pokemon.attacks.push(attack);
        return this;
    }

    public setRetreat(retreat: number): PokemonExBuilder{
        this.pokemon.retreat = retreat;
        return this;
    }

    public setPrefix(prefix: string): PokemonExBuilder{
        this.pokemon.prefix = prefix;
        return this;
    }

    public isEReader(): PokemonExBuilder{
        this.pokemon.subFlags.isEReader = true;
        return this;
    }

    public isEx(shatter = false): PokemonExBuilder{
        this.pokemon.variant = shatter ? Variant.EX_SHATTERED : Variant.EX;
        return this;
    }

    public isGoldStar(): PokemonExBuilder{
        this.pokemon.variant = Variant.GOLDSTAR;
        return this;
    }

    public isPrism(): PokemonExBuilder{
        this.pokemon.variant = Variant.PRISM;
        return this;
    }

    public isDark(): PokemonExBuilder{
        this.pokemon.subFlags.isDark = true;
        return this;
    }

    public isTeamRocket(): PokemonExBuilder{
        this.setPrefix("ROCKET'S");
        this.pokemon.subFlags.isTeamRocket = true;
        return this;
    }

    public isCrystal(): PokemonExBuilder{
        this.pokemon.subFlags.isCrystal = true;
        return this;
    }

    public setWeaknesses(weaknesses: [Type?, Type?]): PokemonExBuilder{
        this.pokemon.weaknesses = weaknesses.filter(t => t != null) as [Type?, Type?];
        return this;
    }

    public setResistances(resistances: [Type?, Type?]): PokemonExBuilder{
        this.pokemon.resistances = resistances.filter(r => r != null) as [Type?, Type?];
        return this;
    }

    public setAbility(ability: { type: LegacyAbilityType; inner: IAbility }): PokemonExBuilder{
        this.pokemon.ability = ability;
        return this;
    }

    public setPokeBody(ability: IAbility): PokemonExBuilder{
        this.setAbility({ type: LegacyAbilityType.BODY, inner: ability});
        return this;
    }

    public setPokePower(ability: IAbility): PokemonExBuilder{
        this.setAbility({ type: LegacyAbilityType.POWER, inner: ability});
        return this;
    }

    public setDualType(dualType: Type): PokemonExBuilder{
        if(this.pokemon.type == dualType) return this;
        this.pokemon.dualType = dualType;
        this.pokemon.variant = Variant.DUAL;
        return this;
    }

    public setDetails(details: ICardDetails): PokemonExBuilder{
        this.pokemon.details = details;
        return this;
    }

    public isHolon(specialType = false): PokemonExBuilder{
        this.pokemon.holon = {
            specialType: specialType,
            type: Type.Colorless,
            amount: 1
        }
        return this;
    }

    public isDeltaSpecies(): PokemonExBuilder{
        this.pokemon.subFlags.isDeltaSpecies = true;
        return this;
    }

    public build(): IPokemon {
        return this.pokemon;
    }

}
