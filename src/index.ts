import {Type} from "./pokemon/type";
import {IPokemonEx} from "./ex/pokemonex";
import {Rarity} from "./pokemon/carddetails";

import React from 'react';
import {createRoot} from 'react-dom/client';
import {PokemonExForm} from "./ex/form/pokemonexform";

import Icon from "./assets/ex/Symbols/promo.png";

import "./style/bootstrap.scss"
import "./style/site.scss"
import "./style/ex_style.scss"

import {PokemonExBuilder} from "./ex/pokemonexbuilder";
import {PredefinedElementDrawerChain} from "./ex/decorators/elementdrawerchainbuilder";

const pokemon = new PokemonExBuilder("Custom")
    .setType(Type.Colorless)
    .setHp(0)
    .isGoldStar()
    .setPokeBody({
        name: "Frost Aura",
        description: "Once during your turn, if Articuno [*] is your Active Pokémon, you may choose one of your opponent's Pokémon and put 1 damage counter on it."
    })
    .addAttack({
        name: "Relentless Blizzard",
        text: "Flip a coin. If heads, this attack does 30 damage to each of your opponent's Pokémon. If tails, this attack does 30 damage to each of your Pokémon, except Articuno [*]. (Don't apply Weakness and Resistance for Benched Pokémon.)",
        energyCost: [Type.Colorless]
    })
    .setRetreat(0)
    .setDetails({
        illustrator: "Ken Sugimori",
        serialNumber: "PKM-CRD-MKR",
        copyright: "©2023 Pokemon/Nintendo",
        cardNumber: "001",
        setTotal: "001",
        rarity: Rarity.COMMON,
        icon: Icon
    })
    .build() as IPokemonEx;

const chain = new PredefinedElementDrawerChain(pokemon, "card");
chain.draw();

const root = createRoot(document.getElementById('settings-form') as Element);
root.render(React.createElement(PokemonExForm));
