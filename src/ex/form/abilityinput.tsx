import React, {ChangeEvent, useCallback, useState} from "react";
import {IAbility, LegacyAbilityType} from "../../pokemon/ability";

import PokePower from "../../assets/ex/Symbols/power.png";
import PokeBody from "../../assets/ex/Symbols/body.png";

interface Props {
    onChangeAbility: (ability: IExAbility | undefined) => void;
}

export interface IExAbility{
    type: LegacyAbilityType;
    inner: IAbility;
}

const AbilityInput = ({ onChangeAbility }: Props) => {
    const [showForm, setShowForm] = useState(false);
    const [type, setType] = useState<LegacyAbilityType>(LegacyAbilityType.POWER);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [removing, setRemoving] = useState(false);

    const handleChangeType = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value as LegacyAbilityType;
            setType(value);
            onChangeAbility({type: value, inner: {name: name, description: description}});
        },
        [name, description, onChangeAbility]
    );

    const handleChangeName = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value as string;
            setName(value);
            onChangeAbility({type: type, inner: {name: value, description: description}});
        },
        [type, description, onChangeAbility]
    );

    const handleChangeDescription = useCallback(
        (event: ChangeEvent<HTMLTextAreaElement>) => {
            const value = event.target.value as string;
            setDescription(value);
            onChangeAbility({type: type, inner: {name: name, description: value}});
        },
        [type, name, onChangeAbility]
    );

    const handleFormChange = useCallback(() => {
        if (removing) {
            setShowForm(false);
        } else {
            setShowForm((prevShowForm) => !prevShowForm);
        }
        setRemoving(false);
    }, [removing]);

    const handleRemoveClick = useCallback(() => {
        setRemoving(true);
        setShowForm(false);
        onChangeAbility(undefined);
    }, []);

    return (
        <div>
            {showForm ? (
                <div>
                    <div className="form-ability-input">
                        <label>
                            <input
                                type="radio"
                                value={LegacyAbilityType.POWER}
                                checked={type === LegacyAbilityType.POWER}
                                onChange={handleChangeType}
                            />
                            <img src={PokePower}/>
                        </label>
                        <label>
                            <input
                                type="radio"
                                value={LegacyAbilityType.BODY}
                                checked={type === LegacyAbilityType.BODY}
                                onChange={handleChangeType}
                            />
                            <img src={PokeBody}/>
                        </label>
                    </div>
                    <div>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={name}
                                onChange={handleChangeName}
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            Description:
                            <textarea
                                value={description}
                                onChange={handleChangeDescription}
                            ></textarea>
                        </label>
                    </div>
                    <button id="remove" className="pure-button pure-button-secondary" type="button" onClick={() => handleRemoveClick()}>Remove</button>
                </div>
            ) : (
                <button id="add" className="pure-button pure-button-secondary" type="button" onClick={() => handleFormChange()}>Add Ability</button>
            )}
        </div>
    );
};

export default AbilityInput;
