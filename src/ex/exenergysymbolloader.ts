import {IEnergySymbolLoader} from "../helpers/energysymbolloader";
import {Type} from "../pokemon/type";
import {AbstractSingleton} from "../helpers/singleton";

import ColorlessEnergySymbol from "../assets/ex/Energy/colorless.png";
import DarkEnergySymbol from "../assets/ex/Energy/dark.png";
import FightingEnergySymbol from "../assets/ex/Energy/fighting.png";
import FireEnergySymbol from "../assets/ex/Energy/fire.png";
import GrassEnergySymbol from "../assets/ex/Energy/grass.png";
import LightningEnergySymbol from "../assets/ex/Energy/lightning.png";
import MetalEnergySymbol from "../assets/ex/Energy/metal.png";
import PsychicEnergySymbol from "../assets/ex/Energy/psychic.png";
import WaterEnergySymbol from "../assets/ex/Energy/water.png";
import DragonEnergySymbol from "../assets/ex/Energy/dragon.png";

export class ExEnergySymbolLoader implements IEnergySymbolLoader{
    private static cache: Map<string, HTMLImageElement> = new Map();

    public static getInstance(): ExEnergySymbolLoader {
        return AbstractSingleton.getInstance(ExEnergySymbolLoader) as ExEnergySymbolLoader;
    }

    public getSymbolImage(type: Type): HTMLElement {
        const key = `${type}`;
        let image = ExEnergySymbolLoader.cache.get(key);
        if (image) {
            return image;
        }

        const src = this.getEnergyImageSrc(type);
        image = new Image();
        image.src = src;
        image.classList.add('poke-energy-symbol')
        ExEnergySymbolLoader.cache.set(key, image);
        return image;
    }

    public getEnergyImageSrc(type: Type): string{
        switch (type) {
            case Type.Colorless:
                return ColorlessEnergySymbol;
            case Type.Dark:
                return DarkEnergySymbol;
            case Type.Fighting:
                return FightingEnergySymbol;
            case Type.Fire:
                return FireEnergySymbol;
            case Type.Grass:
                return GrassEnergySymbol;
            case Type.Lightning:
                return LightningEnergySymbol;
            case Type.Steel:
                return MetalEnergySymbol;
            case Type.Psychic:
                return PsychicEnergySymbol;
            case Type.Water:
                return WaterEnergySymbol;
            case Type.Dragon:
                return DragonEnergySymbol;
            default:
                return "";
        }
    }

    public getSymbolSpan(): HTMLElement {
        const span = $("<span class='poke-energy-symbol-span'></span>");
        return span[0];
    }

    public loadEnergySymbols(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
