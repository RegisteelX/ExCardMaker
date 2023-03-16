import {IPokemon} from "../pokemon/pokemon";
import {Variant} from "./variant";
import {Type} from "../pokemon/type";
import {IAbility, LegacyAbilityType} from "../pokemon/ability";
import {IHolonExtension} from "./holonextension";
import {IPokemonFlags} from "./pokemonflags";

export interface IPokemonEx extends IPokemon{
    prefix?: string;
    variant: Variant;
    weaknesses: [Type?, Type?];
    resistances: [Type?, Type?];
    ability?: { type: LegacyAbilityType, inner: IAbility }
    dualType?: Type
    holon?: IHolonExtension;
    subFlags: IPokemonFlags;
}
