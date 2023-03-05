import { useState } from "react";
import { Type } from "../../pokemon/type";
import { ExEnergySymbolLoader } from "../exenergysymbolloader";
import React from "react";

interface TypeInputProps {
    name: string;
    onChange: (value: Type | undefined) => void;
    value?: Type | undefined;
    nullable?: boolean;
}

const TypeInput = ({ name, onChange, value, nullable = false }: TypeInputProps) => {
    const [selectedType, setSelectedType] = useState<Type | undefined>(value);

    const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const type = event.target.value as Type;
        if (selectedType === type && nullable) {
            setSelectedType(undefined);
            onChange(undefined);
        } else {
            setSelectedType(type);
            onChange(type);
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
                            type="radio"
                            name={name}
                            value={""}
                            checked={selectedType === undefined}
                            onChange={handleTypeChange}
                        />
                        <img
                            src={""}
                            alt={"none"}
                            className={selectedType === undefined ? "selected" : undefined}
                        />
                    </label>
                )}
                {Object.values(Type).map((type: Type) => (
                    <label htmlFor={name + type} key={type} className="form-energy-type-input">
                        <input
                            type="radio"
                            name={name}
                            value={type}
                            checked={selectedType === type}
                            id={name + type}
                            onChange={handleTypeChange}
                            onClick={handleTypeClick}
                        />
                        <img
                            src={symbolLoaderInstance.getEnergyImageSrc(type)}
                            alt={type}
                            className={selectedType === type ? "selected" : undefined}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};

export default TypeInput;
