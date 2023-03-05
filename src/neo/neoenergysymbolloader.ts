import {EnergySymbol} from "../pokemon/energysymbol";
import {Type, TypeOrder} from "../pokemon/type";

import EnergySpriteSheet from "../assets/neo/energy_fixed.png"
import {IEnergySymbolLoader} from "../helpers/energysymbolloader";
import {AbstractSingleton} from "../helpers/singleton";
import {NeoEnergySymbolReplacer} from "./neoenergysymbolreplacer";

export enum SymbolSize {
    MEDIUM,
    LARGE
}

export class NeoEnergySymbolLoader implements IEnergySymbolLoader{
    public spriteSheet: HTMLImageElement;
    private largeSymbols: EnergySymbol[] = [];
    private mediumSymbols: EnergySymbol[] = [];

    public constructor() {
        this.spriteSheet = new Image();
        this.spriteSheet.src = EnergySpriteSheet;
    }

    public static getInstance(): NeoEnergySymbolLoader {
        return AbstractSingleton.getInstance(NeoEnergySymbolLoader) as NeoEnergySymbolLoader;
    }

    public loadEnergySymbols(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.spriteSheet.onload = () => {
                for (let i = 0; i < TypeOrder.length; i++) {
                    const type = TypeOrder[i];

                    const largeSymbol: EnergySymbol = {
                        type: type,
                        width: 27,
                        height: 27,
                        offsetX: i * (27 + 9),
                        offsetY: 0,
                    };

                    const mediumSymbol: EnergySymbol = {
                        type: type,
                        width: 24,
                        height: 24,
                        offsetX: 2 + (i * (24 + 12)),
                        offsetY: 38,
                    };

                    this.largeSymbols.push(largeSymbol);
                    this.mediumSymbols.push(mediumSymbol);
                }

                resolve();
            };

            this.spriteSheet.onerror = () => {
                reject(new Error('Error loading sprite sheet'));
            };
        });
    }

    private getSymbolInfo(type: Type, size: SymbolSize): EnergySymbol | undefined {
        switch (size){
            case SymbolSize.MEDIUM:
                return this.mediumSymbols.find((symbol) => symbol.type === type);
            case SymbolSize.LARGE:
                return this.largeSymbols.find((symbol) => symbol.type === type);
        }
    }

    public getSymbolImage(type: Type, size: SymbolSize): HTMLElement {
        const symbol = this.getSymbolInfo(type, size)!;
        const img = $("<div class='poke-energy-symbol card-element'></div>")

        img.css("background-image", `url("${EnergySpriteSheet}")`)
        img.css("width", `${symbol.width}px`);
        img.css("height", `${symbol.height}px`);
        img.css("backgroundPosition", `-${symbol.offsetX}px -${symbol.offsetY}px`);

        return img[0];
    }

    public getSymbolSpan(type: Type): HTMLElement{
        const symbol = this.getSymbolInfo(type, SymbolSize.LARGE)!;
        const span = $("<span class='poke-energy-symbol-span'></span>")
        return span[0];
    }
}
