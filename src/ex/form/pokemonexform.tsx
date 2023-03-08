import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Type} from '../../pokemon/type';
import {ICardDetails, Rarity} from '../../pokemon/carddetails';
import {IAttack} from '../../pokemon/attack';
import {IEvolutionStage} from '../../pokemon/evolution';
import {StageType} from '../../pokemon/stage';
import {PokemonExBuilder} from '../pokemonexbuilder';
import {PredefinedElementDrawerChain} from '../decorators/elementdrawerchainbuilder';
import TypeInput from './typeinput';
import {CardDetailsSection} from './carddetailssection';
import {Variant} from '../variant';
import CardVariant from './cardvariantcomponent';
import AttackInput from './attacksection';
import ImageUpload from './imageupload';
import AbilityInput, {IExAbility} from './abilityinput';
import {PNGElementExporter} from '../exporters/pngelementexporter';
import WeaknessesResistancesSection from './wrrsection';
import EvolutionStageSection from './evolutionsection';

import Icon from '../../assets/ex/Symbols/promo.png';

import "../../style/form.scss"

enum SpecialType {
    NONE = "None",
    DARK = "Dark",
    EREADER = "E-Reader",
    DELTASPECIES = "Delta Species"
}

export function PokemonExForm() {
    const [prefix, setPrefix] = useState('');
    const [name, setName] = useState('');
    const [teamRocket, setTeamRocket] = useState(false);
    const [type, setType] = useState(Type.Colorless);
    const [dualType, setDualType] = useState(undefined);
    const [variant, setSelectedVariant] = useState<Variant>(Variant.STANDARD);
    const [specialType, setSpecialType] = useState<SpecialType>(SpecialType.NONE);
    const [hp, setHp] = useState(0);
    const [image, setImage] = useState('');
    const [ability, setAbility] = useState(undefined);
    const [attacks, setAttacks] = useState<IAttack[]>([]);
    const [resistances, setResistances] = useState<[Type?, Type?]>([]);
    const [weaknesses, setWeaknesses] = useState<[Type?, Type?]>([]);
    const [retreat, setRetreat] = useState(0);

    const [evolutionStage, setEvolutionStage] = useState<IEvolutionStage>({
        stage: StageType.BASIC,
        evolvesFrom: "",
        image: ""
    });

    const [details, setDetails] = useState<ICardDetails>({
        illustrator: "Ken Sugimori",
        serialNumber: "PKM-CRD-MKR",
        copyright: "©2023 Pokemon/Nintendo",
        cardNumber: "001",
        setTotal: "001",
        rarity: Rarity.COMMON,
        icon: Icon
    });

    const handleTypeChange = (value: Type | undefined) => {
        if(value != undefined){
            setType(value!);
        }
    };

    const handleDualTypeChange = (value: Type | undefined) => {
        if(value != null && specialType !== SpecialType.DELTASPECIES && specialType !== SpecialType.NONE){
            setSpecialType(SpecialType.NONE);
            return;
        }

        setDualType(value as any);
    };

    const handleDetailsChange = (details: ICardDetails) => {
        setDetails(details);
    };

    const handleVariantChange = (variant: Variant) => {
        if(variant === Variant.GOLDSTAR && (specialType != SpecialType.DELTASPECIES && specialType != SpecialType.NONE)){
            setSpecialType(SpecialType.NONE);
        }
        else if(variant === Variant.PRISM){
            setSpecialType(SpecialType.NONE);
        }

        setSelectedVariant(variant);
    };

    const handleAttackChange = (attacks: IAttack[]) => {
        setAttacks(attacks);
    };

    const handleSpecialTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as SpecialType;
        if(teamRocket && value === SpecialType.DELTASPECIES){
            setSpecialType(SpecialType.NONE);
            return;
        }

        if(dualType != null && value !== SpecialType.DELTASPECIES){
            setSpecialType(SpecialType.NONE);
            return;
        }

        setSpecialType(value);
    };

    const handleTeamRocket = () => {
        if(specialType == SpecialType.DELTASPECIES){
            setTeamRocket(false);
            return;
        }
        setTeamRocket(!teamRocket);
    };

    const handleWeaknessChange = (value: [Type?, Type?]) => {
        setWeaknesses(value);
    }

    const handleResistanceChange = (value: [Type?, Type?]) => {
        setResistances(value);
    }

    const handleRetreatChange = (value: number) => {
        setRetreat(value);
    }

    const handleImageChange = (imageUrl: string | null) => {
        setImage(imageUrl != null ? imageUrl : '');
    }

    const handleEvolutionChange = (evolution: IEvolutionStage) => {
        setEvolutionStage(evolution);
    }

    const loadImage = (imageUrl: string) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                loadImageToCanvas(img);
            };
        };

        fetch(imageUrl)
            .then((res) => res.blob())
            .then((blob) => reader.readAsDataURL(blob))
    }

    const loadImageToCanvas = (image: HTMLImageElement) => {
        const canvas = getOrCreateImageCanvas();

        const ctx = canvas.getContext("2d")!;
        const canvasAspectRatio = canvas.width / canvas.height;
        const imageAspectRatio = image.width / image.height;

        if (canvasAspectRatio > imageAspectRatio) {
            const scaleFactor = canvas.width / image.width;
            const scaledHeight = image.height * scaleFactor;
            const y = (canvas.height - scaledHeight) / 2;
            ctx.drawImage(image, 0, y, canvas.width, scaledHeight);
        } else {
            const scaleFactor = canvas.height / image.height;
            const scaledWidth = image.width * scaleFactor;
            const x = (canvas.width - scaledWidth) / 2;
            ctx.drawImage(image, x, 0, scaledWidth, canvas.height);
        }
    }

    const getOrCreateImageCanvas = (): HTMLCanvasElement  => {
        const canvas = $("#imageCanvas");
        if(canvas.length !== 0){
            return canvas[0] as HTMLCanvasElement;
        }

        const imageCanvas = $("<canvas id='imageCanvas' width='609' height='377'></canvas>")
        imageCanvas.setElementPosition(107, 69, null, null).appendTo($("#card"));

        return imageCanvas[0] as HTMLCanvasElement;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>): void{
        event.preventDefault();

        const pokemonBuilder = new PokemonExBuilder(name)
            .setType(type)
            .setHp(hp)
            .setEvolution(evolutionStage)
            .setResistances(resistances)
            .setWeaknesses(weaknesses)
            .setRetreat(retreat)
            .setDetails(details);

        if(teamRocket){
            pokemonBuilder.isTeamRocket();
        }

        if(prefix !== ''){
            pokemonBuilder.setPrefix(prefix);
        }

        if(dualType && variant === Variant.STANDARD){
            pokemonBuilder.setDualType(dualType!);
        }

        if(image !== ''){
            loadImage(image);
        }

        if(ability != null){
            pokemonBuilder.setAbility(ability!);
        }

        for(let attack of attacks){
            pokemonBuilder.addAttack(attack);
        }

        switch (variant){
            case Variant.EX:
                pokemonBuilder.isEx(false);
                break;
            case Variant.PRISM:
                pokemonBuilder.isPrism();
                break;
            case Variant.GOLDSTAR:
                pokemonBuilder.isGoldStar();
                break;
        }

        switch (specialType){
            case SpecialType.DARK:
                pokemonBuilder.isDark();
                break;
            case SpecialType.EREADER:
                pokemonBuilder.isEReader();
                break;
            case SpecialType.DELTASPECIES:
                pokemonBuilder.isDeltaSpecies();
                break;
        }

        const pokemon = pokemonBuilder.build();
        $("#card").empty();


        //TODO: Rework spacing system and take screen resolutions into account.
        const fixer = $("#card-fixer").addClass("card-image-saving");
        const chain = new PredefinedElementDrawerChain(pokemon, "card");
        chain.draw().then(() => {
            fixer.removeClass("card-image-saving");
        });
    }

    const onAbilityChange = (ability: IExAbility | undefined) => {
        setAbility(ability as any);
    }

    const downloadImage = () => {
        const cardFixer = $("#card-fixer").addClass("card-image-saving");
        const card = $("#card");
        const exporter = new PNGElementExporter(card, name, prefix);
        exporter.export().then(() => {
            cardFixer.removeClass("card-image-saving");
        });
    }

    return (
        <form onSubmit={handleSubmit} className="pure-form pure-form-stacked">
            <div className="pure-g">
                <div className="pure-u-md-1-2">
                    <fieldset>
                        <legend>Basics</legend>
                        <div className="pure-g">
                            <div className="pure-u-md-1-3">
                                <label className="pure-form-message">
                                    Prefix:
                                    <input className="pure-u-23-24"  type="text" value={prefix} onChange={event => setPrefix(event.target.value)} />
                                </label>
                            </div>
                            <div className="pure-u-md-1-3">
                                <label className="pure-form-message">
                                    Name:
                                    <input className="pure-u-23-24" type="text" value={name} onChange={event => setName(event.target.value)} />
                                </label>
                            </div>
                            <div className="pure-u-md-1-3">
                                <label className="pure-form-message">
                                    HP:
                                    <input className="pure-u-23-24" type="number" value={hp} onChange={event => setHp(parseInt(event.target.value))} />
                                </label>
                            </div>
                        </div>
                        <div className="pure-form-message">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={teamRocket}
                                    onChange={handleTeamRocket}
                                /> Team Rocket's
                            </label>
                        </div>
                        <label className="pure-form-message">
                            Type:
                            <TypeInput name="type" value={type} onChange={handleTypeChange} nullable={false}/>
                        </label>
                        <label className="pure-form-message">
                            Secondary Type:
                            <TypeInput name="dualType" value={dualType} onChange={handleDualTypeChange} nullable={true}/>
                        </label>
                        <label className="pure-form-message">
                            Variant:
                            <CardVariant name="variant" value={variant} onChange={handleVariantChange} />
                        </label>
                        <label className="pure-form-message">
                            Specials:
                            <select value={specialType} onChange={handleSpecialTypeChange}>
                                {Object.values(SpecialType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </fieldset>
                    <fieldset>
                        <legend>Image</legend>
                        <div className="pure-g">
                            <div className="pure-u-md-1-3">
                                <label className="pure-form-message">
                                    <ImageUpload previewMaxWidth={609 * 0.25} previewMaxHeight={377 * 0.25} onImageSelect={handleImageChange} />
                                </label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Evolution</legend>
                        <EvolutionStageSection onChange={handleEvolutionChange}/>
                    </fieldset>
                    <fieldset>
                        <legend>Ability</legend>
                        <AbilityInput onChangeAbility={onAbilityChange}/>
                    </fieldset>
                    <fieldset>
                        <legend>Attacks</legend>
                        <AttackInput name="attacks" label="Attacks" value={attacks} onChange={handleAttackChange} />
                    </fieldset>
                    <fieldset>
                        <legend>Weakness, resistance and retreat.</legend>
                        <WeaknessesResistancesSection
                            onWeaknessesChange={handleWeaknessChange}
                            onResistancesChange={handleResistanceChange}
                            onRetreatChange={handleRetreatChange}
                            resistances={resistances}
                            weaknesses={weaknesses}
                            retreat={retreat}/>
                    </fieldset>
                    <fieldset>
                        <legend>Details</legend>
                        <CardDetailsSection details={details} onChange={handleDetailsChange} />
                    </fieldset>
                </div>
            </div>
            <div className="pure-g">
                <div className="pure-u-md-1-2">
                    <button className="pure-button pure-button-primary" type="submit">Create Card</button>
                </div>
                <div className="pure-u-md-1-2">
                    <button id="saveButton" className="pure-button pure-button-primary" type="button" onClick={downloadImage}>Save Card</button>
                </div>
            </div>
        </form>
    );
}
