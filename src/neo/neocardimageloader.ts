import {Type} from "../pokemon/type";

import ColorlessBasicTemplate from "../assets/neo/colorlessbasic.png"
import GrassBasicTemplate from "../assets/neo/grassbasic.png"
import WaterBasicTemplate from "../assets/neo/waterbasic.png"
import DarkBasicTemplate from "../assets/neo/darknessbasic.png"
import SteelBasicTemplate from "../assets/neo/metalbasic.png"
import DragonBasicTemplate from "../assets/neo/dragonbasic.png"
import FireBasicTemplate from "../assets/neo/firebasic.png"
import FightingBasicTemplate from "../assets/neo/fightingbasic.png"
import ElectricBasicTemplate from "../assets/neo/lightningbasic.png"
import PsychicBasicTemplate from "../assets/neo/psychicbasic.png"
import {IImageloader} from "../helpers/imageloader";

export class NeoCardImageLoader implements IImageloader{

    public getImageSrc(type: Type): string{
        switch (type) {
            case Type.Colorless:
                return ColorlessBasicTemplate;
            case Type.Fighting:
                return FightingBasicTemplate;
            case Type.Steel:
                return SteelBasicTemplate;
            case Type.Fire:
                return FireBasicTemplate;
            case Type.Water:
                return WaterBasicTemplate;
            case Type.Grass:
                return GrassBasicTemplate;
            case Type.Electric:
                return ElectricBasicTemplate;
            case Type.Psychic:
                return PsychicBasicTemplate;
            case Type.Dragon:
                return DragonBasicTemplate;
            case Type.Dark:
                return DarkBasicTemplate;
            case Type.Null:
            default:
                return "";
        }
    }
}
