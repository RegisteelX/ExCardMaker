export class ImageScanner {
    private readonly scanBrightness: number;
    private readonly scanContrast: number;
    private readonly scanBlur: number;
    private readonly scanGrayscale: boolean;

    constructor(
        brightness: number = 0,
        contrast: number = 0,
        blur: number = 0,
        grayscale: boolean = false
    ) {
        this.scanBrightness = brightness;
        this.scanContrast = contrast;
        this.scanBlur = blur;
        this.scanGrayscale = grayscale;
    }

    public async scanImage(image: HTMLCanvasElement): Promise<HTMLCanvasElement> {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0);

        // Apply brightness adjustment
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] += this.scanBrightness;
            imageData.data[i + 1] += this.scanBrightness;
            imageData.data[i + 2] += this.scanBrightness;
        }
        ctx.putImageData(imageData, 0, 0);

        // Apply contrast adjustment
        const factor = (259 * (this.scanContrast + 255)) / (255 * (259 - this.scanContrast));
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = factor * (imageData.data[i] - 128) + 128;
            imageData.data[i + 1] = factor * (imageData.data[i + 1] - 128) + 128;
            imageData.data[i + 2] = factor * (imageData.data[i + 2] - 128) + 128;
        }
        ctx.putImageData(imageData, 0, 0);

        // Apply blur
        ctx.filter = `blur(${this.scanBlur}px)`;
        ctx.drawImage(canvas, 0, 0);

        // Convert to grayscale
        if (this.scanGrayscale) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
                const gray = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                imageData.data[i] = gray;
                imageData.data[i + 1] = gray;
                imageData.data[i + 2] = gray;
            }
            ctx.putImageData(imageData, 0, 0);
        }

        const scanlineImage = await this.createScanlineImage(canvas.width, canvas.height);
        const noiseImage = await this.createNoiseImage(canvas.width, canvas.height);

        ctx.globalAlpha = 0.1;
        ctx.drawImage(noiseImage, 0, 0);
        ctx.globalAlpha = 0.2;
        ctx.drawImage(scanlineImage, 0, 0);
        ctx.globalAlpha = 1.0;

        return canvas;
    }

    private async createScanlineImage(width: number, height: number): Promise<HTMLCanvasElement> {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        const scanlineHeight = 1;
        const scanlineSpacing = 3;

        for (let y = 0; y < canvas.height; y += scanlineHeight + scanlineSpacing) {
            const imageData = ctx.createImageData(canvas.width, scanlineHeight);
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = 0;
                imageData.data[i + 1] = 0;
                imageData.data[i + 2] = 0;
                imageData.data[i + 3] = Math.random() * 50 + 50; // random alpha between 50 and 100
            }
            ctx.putImageData(imageData, 0, y);
        }

        return canvas;
    }

    private async createNoiseImage(width: number, height: number): Promise<HTMLCanvasElement> {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d")!;
        const noiseData = new Uint8ClampedArray(width * height * 4);

        for (let i = 0; i < noiseData.length; i += 4) {
            noiseData[i] = noiseData[i + 1] = noiseData[i + 2] = Math.random() * 255;
            noiseData[i + 3] = 10; // alpha of noise pixels is 10 (out of 255)
        }
        const noiseImage = new ImageData(noiseData, width, height);
        ctx.putImageData(noiseImage, 0, 0);

        return canvas;
    }
}
