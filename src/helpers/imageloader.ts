import {Type} from "../pokemon/type";

export interface IImageloader{
    getImageSrc(type: Type): string;
}
