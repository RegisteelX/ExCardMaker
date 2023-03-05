export enum Rarity{
    COMMON = "Common",
    UNCOMMON = "Uncommon",
    RARE = "Rare",
    ULTRA = "Super Rare"
}

export interface ICardDetails{
    illustrator?: string;
    serialNumber?: string;
    copyright?: string;
    cardNumber?: string;
    setTotal?: string;
    rarity?: Rarity;
    icon?: string;
}
