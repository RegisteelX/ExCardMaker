import { useState } from "react";
import { Type } from "../../pokemon/type";
import { ExEnergySymbolLoader } from "../exenergysymbolloader";
import React from "react";

interface CostInputProps {
    name: string;
    onChange: (value: Type[]) => void;
}

const CostInput = ({ name, onChange }: CostInputProps) => {
    const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);

    const handleTypeChange = (type: Type, decrease: boolean) => {
        if(selectedTypes.length < 5 && !decrease){
            selectedTypes.push(type);
        }
        else if(decrease){
            let index = selectedTypes.findIndex(t => t === type);
            if (index > -1) {
                selectedTypes.splice(index, 1);
            }
        }
        onChange(selectedTypes);
    };

    const handleTypeClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        handleTypeChange(event.currentTarget.getAttribute("datatype") as Type, false);
    }

    const handleTypeLeftClick = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        event.preventDefault()
        handleTypeChange(event.currentTarget.getAttribute("datatype") as Type, true);
    }

    const getCountForType = (type: Type): number => {
        return selectedTypes.filter(t => t === type).length;
    }

    const symbolLoaderInstance = ExEnergySymbolLoader.getInstance();

    return (
        <div>
            <div className="form-energy-type-container">
                {Object.values(Type).map((type: Type) => (
                    <label htmlFor={name + type} key={type} className="form-energy-type-input">
                        <img
                            src={symbolLoaderInstance.getEnergyImageSrc(type)}
                            alt={type}
                            onClick={handleTypeClick}
                            onContextMenu={handleTypeLeftClick}
                            datatype={type}
                        />
                        {getCountForType(type) > 0 &&
                            <p className="type-counter">
                                { getCountForType(type) }
                            </p>
                        }
                    </label>
                ))}
            </div>
        </div>
    );
};

export default CostInput;
