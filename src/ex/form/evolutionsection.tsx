import React, {useEffect, useState} from "react";
import ImageUpload from "./imageupload";
import {StageType} from "../../pokemon/stage";
import {IEvolutionStage} from "../../pokemon/evolution";

interface EvolutionStageProps {
    onChange: (stage: IEvolutionStage) => void;
}

const EvolutionStageSection = ({ onChange }: EvolutionStageProps) => {
    const [stage, setStage] = useState<StageType>(StageType.BASIC);
    const [evolvesFrom, setEvolvesFrom] = useState<string>("");
    const [image, setImage] = useState<string>("");

    useEffect(() => {
        changeEvolutionStage();
    }, [stage, evolvesFrom, image]);

    const handleStageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStage(e.target.value as StageType);
    }

    const handleEvolutionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEvolvesFrom(e.target.value);
    }

    const handleImageChange = (value: string) => {
        setImage(value);
    }

    const changeEvolutionStage = () => {
        const newStage: IEvolutionStage = {
            stage,
            evolvesFrom,
            image,
        };
        onChange(newStage);
    };

    return (
        <div>
            <label>
                Stage:
                <select value={stage} onChange={handleStageChange}>
                    <option value={StageType.BASIC}>Basic</option>
                    <option value={StageType.STAGE1}>Stage 1</option>
                    <option value={StageType.STAGE2}>Stage 2</option>
                </select>
            </label>
            <br />
            <label>
                Evolves From:
                <input type="text" value={evolvesFrom} onChange={handleEvolutionChange} />
            </label>
            <br />
            <label>
                Image:
                <ImageUpload
                    onImageSelect={handleImageChange}
                    previewMaxWidth={90}
                    previewMaxHeight={82}
                />
            </label>
        </div>
    );
};

export default EvolutionStageSection;
