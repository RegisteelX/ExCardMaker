import { useState } from "react";
import React from "react";
import {ICardDetails, Rarity} from "../../pokemon/carddetails";
import ImageUpload from "./imageupload";

interface CardDetailsFormProps {
    details: ICardDetails;
    onChange: (details: ICardDetails) => void;
}

export const CardDetailsSection = ({ details, onChange }: CardDetailsFormProps) => {
    const [illustrator, setIllustrator] = useState(details.illustrator || "");
    const [serialNumber, setSerialNumber] = useState(details.serialNumber || "");
    const [copyright, setCopyright] = useState(details.copyright || "");
    const [cardNumber, setCardNumber] = useState(details.cardNumber || "");
    const [setTotal, setSetTotal] = useState(details.setTotal || "");
    const [rarity, setRarity] = useState(details.rarity || Rarity.COMMON);
    // eslint-disable-next-line  @typescript-eslint/no-unused-vars
    const [icon, setIcon] = useState(details.icon || "");

    const handleIllustratorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setIllustrator(value);
        onChange({...details, illustrator: value});
    };

    const handleSerialNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSerialNumber(value);
        onChange({...details, serialNumber: value});
    };

    const handleCopyrightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCopyright(value);
        onChange({...details, copyright: value});
    };

    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setCardNumber(value);
        onChange({...details, cardNumber: value});
    };

    const handleSetTotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSetTotal(value);
        onChange({...details, setTotal: value});
    };

    const handleRarityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as Rarity;
        setRarity(value);
        onChange({...details, rarity: value});
    };

    const handleIconChange = (imageUrl: string | null) => {
        setIcon(imageUrl as string);
        onChange({...details, icon: imageUrl!});
    };

    return (
        <div>
            <div className="pure-g">
                <div className="pure-u-md-1-3">
                    <label className="pure-form-message">
                        Illustrator:
                        <input className="pure-u-23-24" type="text" value={illustrator} onChange={handleIllustratorChange}/>
                    </label>
                </div>
                <div className="pure-u-md-1-3">
                    <label className="pure-form-message">
                        Serial Number:
                        <input className="pure-u-23-24" type="text" value={serialNumber} onChange={handleSerialNumberChange}/>
                    </label>
                </div>
                <div className="pure-u-md-1-3">
                    <label className="pure-form-message">
                        Copyright:
                        <input className="pure-u-23-24" type="text" value={copyright} onChange={handleCopyrightChange}/>
                    </label>
                </div>
            </div>
            <div className="pure-g">
                <div className="pure-u-md-1-3">
                    <label className="pure-form-message">
                        Card Number:
                        <input className="pure-u-23-24" type="text" value={cardNumber} onChange={handleCardNumberChange}/>
                    </label>
                </div>
                <div className="pure-u-md-1-3">
                    <label className="pure-form-message">
                        Set Total:
                        <input className="pure-u-23-24" type="text" value={setTotal} onChange={handleSetTotalChange}/>
                    </label>
                </div>
                <div className="pure-u-md-1-3">
                    <label className="pure-form-message">
                        Rarity:
                        <select className="pure-u-23-24" value={rarity} onChange={handleRarityChange}>
                            {Object.values(Rarity).map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>
            <div className="pure-g">
                <div className="pure-u-md-1-1">
                    <label className="pure-form-message">
                        Icon:
                        <ImageUpload previewMaxWidth={32} previewMaxHeight={32} onImageSelect={handleIconChange} />
                    </label>
                </div>
            </div>
        </div>
    );
};
