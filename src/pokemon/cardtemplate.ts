import {IPokemon} from "./pokemon";

export abstract class CardTemplate {
    protected root: HTMLElement;
    protected pokemon: IPokemon;

    protected constructor(containerId: string, pokemon: IPokemon) {
        this.root = document.getElementById(containerId) as HTMLElement;
        this.pokemon = pokemon;
    }

    abstract drawTemplate(): Promise<void>;
    abstract drawName(): void
    abstract drawHP(): void;
    abstract drawAttacks(): void;
    abstract drawWeaknessAndResistance(): void;
    abstract drawRetreatCost(): void;
    abstract drawDetails(): void;

    public draw(): void {
        this.drawTemplate().then(() => {
            this.drawName();
            this.drawHP();
            this.drawAttacks();
            this.drawWeaknessAndResistance();
            this.drawRetreatCost();
            this.drawDetails();
        });
    }
}
