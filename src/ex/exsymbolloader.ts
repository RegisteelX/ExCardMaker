import {Variant} from "./variant";

import ExSymbolImage from "../assets/ex/Variants/ex.png";
import ExSymbolInvertedImage from "../assets/ex/Variants/ex_invert.png";
import GoldStarSymbolImage from "../assets/ex/Variants/goldstr.png";
import PrismSymbolImage from "../assets/ex/Variants/prism.png";
import MythicalSymbolImage from "../assets/ex/Variants/mythical.png";
import MythicalSymbolInvertedImage from "../assets/ex/Variants/mythical_invert.png";

export class ExSymbolLoader {
    private static cache: Map<string, HTMLImageElement> = new Map();

    public loadSymbol(variant: Variant, invert = false): HTMLImageElement {
        const key = `${variant}-${invert}`;
        let image = ExSymbolLoader.cache.get(key);
        if (image) {
            return image;
        }

        const src = this.getImageSrc(variant, invert);
        image = new Image();
        image.src = src;
        image.classList.add('poke-name-variant')
        ExSymbolLoader.cache.set(key, image);
        return image;
    }

    private getImageSrc(variant: Variant, invert: boolean): string {
        switch (variant) {
            case Variant.EX:
            case Variant.EX_SHATTERED:
                return invert ? ExSymbolInvertedImage : ExSymbolImage;
            case Variant.MYTHICAL:
                return invert ? MythicalSymbolInvertedImage : MythicalSymbolImage;
            case Variant.GOLDSTAR:
                return GoldStarSymbolImage;
            case Variant.PRISM:
                return PrismSymbolImage;
            default:
                return "";
        }
    }
}
