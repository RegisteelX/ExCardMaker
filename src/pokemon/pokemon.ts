import {IAttack} from "./attack";
import {IAbility} from "./ability";
import {Type} from "./type";
import {ICardDetails} from "./carddetails";
import {IEvolutionStage} from "./evolution";

export interface IPokemon {
    name: string;
    type: Type;
    hp: number;
    evolution?: IEvolutionStage;
    pokeBody?: IAbility;
    pokePower?: IAbility;
    attacks: IAttack[];
    weakness?: Type;
    resistance?: Type;
    retreat: number;
    details?: ICardDetails;
}
