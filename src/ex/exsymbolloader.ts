import {Variant} from "./variant";

import ExSymbolImage from "../assets/ex/Variants/ex.png";
import GoldStarSymbolImage from "../assets/ex/Variants/goldstr.png";
import PrismSymbolImage from "../assets/ex/Variants/prism.png";

export class ExSymbolLoader {
    private static cache: Map<string, HTMLImageElement> = new Map();

    public loadSymbol(variant: Variant): HTMLImageElement {
        const key = `${variant}`;
        let image = ExSymbolLoader.cache.get(key);
        if (image) {
            return image;
        }

        const src = this.getImageSrc(variant);
        image = new Image();
        image.src = src;
        image.classList.add('poke-name-variant')
        ExSymbolLoader.cache.set(key, image);
        return image;
    }

    private getImageSrc(variant: Variant): string {
        switch (variant) {
            case Variant.EX:
            case Variant.EX_SHATTERED:
                return ExSymbolImage;
            case Variant.GOLDSTAR:
                return GoldStarSymbolImage;
            case Variant.PRISM:
                return PrismSymbolImage;
            default:
                return "";
        }
    }
}
