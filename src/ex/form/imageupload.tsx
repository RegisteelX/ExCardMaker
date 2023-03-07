import React, { useState } from "react";

interface ImageUploadProps {
    previewWidth?: number;
    previewHeight?: number;
    previewMaxWidth?: number;
    previewMaxHeight?: number;
    onImageSelect: (imageUrl: string | null) => void;
}

const ImageUpload = ({ previewWidth, previewHeight, previewMaxWidth, previewMaxHeight, onImageSelect }: ImageUploadProps) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imageWidth, setImageWidth] = useState<number | null>(null);
    const [imageHeight, setImageHeight] = useState<number | null>(null);

    const inputRef = React.createRef<HTMLInputElement>();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!e.target.files) return;

        const selectedFile = e.target.files[0];

        if (!selectedFile.type.match(/image.*/)) {
            alert("Please select an image file");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setImagePreviewUrl(reader.result as string);
            onImageSelect(reader.result as string);
        };

        reader.readAsDataURL(selectedFile);
        setFile(selectedFile);
    };

    const actualPreviewWidth = imagePreviewUrl ? getImageWidth() : previewWidth || previewMaxWidth;
    const actualPreviewHeight = imagePreviewUrl ? getImageHeight() : previewHeight || previewMaxHeight;

    function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
        const img = e.currentTarget;
        setImageWidth(img.naturalWidth);
        setImageHeight(img.naturalHeight);
    }

    function getImageWidth() {
        if (!imageWidth) return previewWidth || previewMaxWidth;
        if (previewMaxWidth && imageWidth > previewMaxWidth) {
            return previewMaxWidth;
        } else {
            return imageWidth;
        }
    }

    function getImageHeight() {
        if (!imageHeight) return previewHeight || previewMaxHeight;
        if (previewMaxHeight && imageHeight > previewMaxHeight) {
            return previewMaxHeight;
        } else {
            return imageHeight;
        }
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setImagePreviewUrl("");
        setFile(null);
        setImageWidth(null);
        setImageHeight(null);

        inputRef.current!.value = "";
        onImageSelect(null);
    };

    return (
        <div>
            <input ref={inputRef} type="file" onChange={handleImageChange} />
            {imagePreviewUrl && (
                <div>
                    <div>
                        <img
                            src={imagePreviewUrl}
                            alt="Image Preview"
                            onLoad={handleImageLoad}
                            style={{ width: actualPreviewWidth, height: actualPreviewHeight, objectFit: "cover" }}
                        />
                    </div>
                    <div>
                        <button type="button" className="pure-button pure-button-secondary" onClick={handleRemoveImage}>X</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
