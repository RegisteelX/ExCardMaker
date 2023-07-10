import {StageType} from "./stage";
import {IPokemon} from "./pokemon";

export interface IEvolutionStage{
    stage: StageType;
    evolvesFrom: string;
    image: string;
}

export function IsEvolved(pokemon: IPokemon) {
    return pokemon.evolution != null && pokemon.evolution.stage != StageType.BASIC;
}
