import React, {useState} from "react";
import {IAttack} from "../../pokemon/attack";
import CostInput from "./costinput";

interface AttackInputProps {
    label: string;
    value?: IAttack[];
    onChange: (value: IAttack[]) => void;
}

const AttackInput = ({label, value = [], onChange }: AttackInputProps) => {
    const [attacks, setAttacks] = useState<IAttack[]>(value);
    const handleAddAttack = () => {
        setAttacks([...attacks, { name: "", text: "", damage: "", energyCost: []}]);
    };

    const handleDeleteAttack = (index: number) => {
        const newAttacks = [...attacks];
        newAttacks.splice(index, 1);
        setAttacks(newAttacks);
        onChange(newAttacks);
    };

    const handleAttackChange = (index: number, updatedAttack: IAttack) => {
        const newAttacks = [...attacks];
        newAttacks[index] = updatedAttack;
        setAttacks(newAttacks);
        onChange(newAttacks);
    };

    return (
        <div className="form-attack-container">
            <div className="form-attack-header">{label}</div>
            {attacks.map((attack, index) => (
                <div key={index} className="form-attack">
                    <input
                        type="text"
                        value={attack.name}
                        placeholder="Name"
                        onChange={(e) => handleAttackChange(index, { ...attack, name: e.target.value })}
                    />
                    <textarea
                        value={attack.text}
                        onChange={(e) => handleAttackChange(index, { ...attack, text: e.target.value })}
                    ></textarea>
                    <input
                        type="text"
                        value={attack.damage}
                        placeholder="Damage"
                        onChange={(e) => handleAttackChange(index, { ...attack, damage: e.target.value })}
                    />
                    <CostInput name="attack-cost" onChange={(values) => handleAttackChange(index, { ...attack, energyCost: values })}/>
                    <button className="pure-button pure-button-secondary" onClick={() => handleDeleteAttack(index)}>Remove</button>
                </div>
            ))}
            <button className="pure-button pure-button-secondary" onClick={handleAddAttack} type="button">Add Attack</button>
        </div>
    );
};

export default AttackInput;
