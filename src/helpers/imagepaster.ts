export class ImagePaster{

    private canvas: HTMLCanvasElement;

    public constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public bindListener(): void {
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
        window.addEventListener("paste", (event: any) => {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === -1) {
                    continue;
                }
                const blob = items[i].getAsFile();
                const image = new Image();
                image.src = URL.createObjectURL(blob);
                image.onload = () => {
                    const ctx = this.canvas.getContext("2d")!;
                    const canvasAspectRatio = this.canvas.width / this.canvas.height;
                    const imageAspectRatio = image.width / image.height;

                    if (canvasAspectRatio > imageAspectRatio) {
                        // canvas is wider than the image
                        const scaleFactor = this.canvas.width / image.width;
                        const scaledHeight = image.height * scaleFactor;
                        const y = (this.canvas.height - scaledHeight) / 2;
                        ctx.drawImage(image, 0, y, this.canvas.width, scaledHeight);
                    } else {
                        // canvas is taller than the image
                        const scaleFactor = this.canvas.height / image.height;
                        const scaledWidth = image.width * scaleFactor;
                        const x = (this.canvas.width - scaledWidth) / 2;
                        ctx.drawImage(image, x, 0, scaledWidth, this.canvas.height);
                    }
                };
                break;
            }
        });
    }

}
