import {useEffect, useState} from "react";
import { Type } from "../../pokemon/type";
import { ExEnergySymbolLoader } from "../exenergysymbolloader";
import React from "react";

interface TypeInputProps {
    name: string;
    onChange: (value: Type[] | undefined) => void;
    value?: Type[] | undefined;
    nullable?: boolean;
    maxSelections?: number;
}

const MultiTypeInput = ({ name, onChange, value, nullable = false, maxSelections = 1 }: TypeInputProps) => {
    const [selectedTypes, setSelectedTypes] = useState<Type[] | undefined>(value);

    useEffect(() => {
        onChange(selectedTypes);
    }, [selectedTypes]);

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const type = event.target.value as Type;
        if (selectedTypes?.includes(type)) {
            setSelectedTypes(selectedTypes.filter((t) => t !== type));
        } else if (selectedTypes?.length === maxSelections) {
            const newTypes = [...selectedTypes.slice(1), type];
            setSelectedTypes(newTypes);
        } else {
            setSelectedTypes(selectedTypes ? [...selectedTypes, type] : [type]);
        }
    };

    const handleTypeClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        if(nullable){
            handleTypeChange(event as unknown as React.ChangeEvent<HTMLInputElement>);
        }
    }

    const symbolLoaderInstance = ExEnergySymbolLoader.getInstance();

    return (
        <div>
            <div className="form-energy-type-container">
                {nullable && (
                    <label key={"none"} className="form-energy-type-input hidden">
                        <input
                            type="checkbox"
                            name={name}
                            value={""}
                            checked={!selectedTypes || selectedTypes.length === 0}
                            onChange={handleTypeChange}
                        />
                        <img
                            src={""}
                            alt={"none"}
                            className={!selectedTypes || selectedTypes.length === 0 ? "selected" : undefined}
                        />
                    </label>
                )}
                {Object.values(Type).map((type: Type) => (
                    <label htmlFor={name + type} key={type} className="form-energy-type-input">
                        <input
                            type="checkbox"
                            name={name}
                            value={type}
                            checked={selectedTypes?.includes(type)}
                            id={name + type}
                            onChange={handleTypeChange}
                            onClick={handleTypeClick}
                        />
                        <img
                            src={symbolLoaderInstance.getEnergyImageSrc(type)}
                            alt={type}
                            className={selectedTypes?.includes(type) ? "selected" : undefined}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default MultiTypeInput;
