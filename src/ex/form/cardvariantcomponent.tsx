import React from "react";
import {Variant} from "../variant";

interface VariantSelectProps {
    name: string;
    value?: Variant;
    onChange: (value: Variant) => void;
}

const CardVariant = ({ name, value, onChange }: VariantSelectProps) => {
    const excludedVariants = [Variant.DUAL, Variant.EX_SHATTERED];

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value as Variant;
        onChange(value);
    };

    return (
        <select name={name} value={value} onChange={handleChange}>
        {Object.values(Variant)
                .filter((variant) => !excludedVariants.includes(variant))
                .map((variant) => (
                    <option key={variant} value={variant}>
                        {variant}
                    </option>
        ))}
        </select>
);
};

export default CardVariant;
