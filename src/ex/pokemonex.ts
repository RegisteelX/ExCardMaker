import {IPokemon} from "../pokemon/pokemon";
import {Variant} from "./variant";
import {Type} from "../pokemon/type";
import {IAbility, LegacyAbilityType} from "../pokemon/ability";
import {IHolonExtension} from "./holonextension";

export interface IPokemonEx extends IPokemon{
    prefix?: string;
    variant: Variant;
    weaknesses: [Type?, Type?];
    resistances: [Type?, Type?];
    ability?: { type: LegacyAbilityType, inner: IAbility }
    dualType?: Type
    isDark: boolean;
    isTeamRocket: boolean
    holon?: IHolonExtension;
    isDeltaSpecies: boolean;
    isEReader: boolean;
}
