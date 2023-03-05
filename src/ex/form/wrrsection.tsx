import { Type } from "../../pokemon/type";
import React, { useState } from "react";
import TypeInput from "./TypeInput";
import MultiTypeInput from "./multitypeinput";

interface WeaknessesResistancesFormProps {
    onWeaknessesChange: (values: [Type?, Type?]) => void;
    weaknesses: [Type?, Type?];
    onResistancesChange: (values: [Type?, Type?]) => void;
    resistances: [Type?, Type?];
    onRetreatChange: (value: number) => void;
    retreat: number;
}

const WeaknessesResistancesSection = ({
                                       onWeaknessesChange,
                                       weaknesses,
                                       onResistancesChange,
                                       resistances,
                                       onRetreatChange,
                                       retreat,
                                   }: WeaknessesResistancesFormProps) => {
    const handleWeaknessesChange = (value: Type[] | undefined) => {
        const convert: [Type? , Type?] = [];
        if(value){
            if(value.length > 0){
                convert.push(value[0]);
            }
            if(value.length > 1){
                convert.push(value[1]);
            }
        }
        onWeaknessesChange(convert);
    };

    const handleResistancesChange = (value: Type[] | undefined) => {
        const convert: [Type? , Type?] = [];
        if(value){
            if(value.length > 0){
                convert.push(value[0]);
            }
            if(value.length > 1){
                convert.push(value[1]);
            }
        }
        onResistancesChange(convert);
    };

    const handleRetreatChange = (value: number) => {
        onRetreatChange(value);
    };

    return (
        <div>
            <div className="pure-g">
                <label className="pure-form-message">
                    Weakness(es)
                    <MultiTypeInput
                        name="weaknesses"
                        value={weaknesses as Type[]}
                        onChange={handleWeaknessesChange}
                        nullable={true}
                        maxSelections={2}
                    />
                </label>
            </div>
            <div className="pure-g">
                <label className="pure-form-message">
                    Resistance(s)
                    <MultiTypeInput
                        name="resistances"
                        value={resistances as Type[]}
                        onChange={handleResistancesChange}
                        nullable={true}
                        maxSelections={2}
                    />
                </label>
            </div>
            <div>
                <label className="pure-form-message">
                    Retreat Cost
                    <RetreatInput value={retreat} onChange={handleRetreatChange} />
                </label>
            </div>
        </div>
    );
};

interface RetreatInputProps {
    value: number;
    onChange: (value: number) => void;
}

const RetreatInput = ({ value, onChange }: RetreatInputProps) => {
    const [selectedValue, setSelectedValue] = useState<number>(value);

    const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = parseInt(event.target.value);
        setSelectedValue(newValue);
        onChange(newValue);
    };

    return (
        <select value={selectedValue} onChange={handleValueChange}>
            {[0, 1, 2, 3, 4].map((value) => (
                <option key={value} value={value}>
                    {value}
                </option>
            ))}
        </select>
    );
};

export default WeaknessesResistancesSection;
