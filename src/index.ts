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
import {VersionControl} from "./helpers/versioncontrol";

const pokemon = new PokemonExBuilder("Custom Card")
    .setType(Type.Colorless)
    .setHp(0)
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

const versionControl = new VersionControl(1, 5, 0);
versionControl.createFooter();
