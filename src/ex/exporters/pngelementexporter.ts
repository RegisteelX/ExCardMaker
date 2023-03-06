import html2canvas from "html2canvas";

export class PNGElementExporter{

    private readonly name: string;

    private readonly prefix: string | undefined;

    private readonly element: JQuery<HTMLElement>;

    public constructor(element: JQuery<HTMLElement>, name: string, prefix: string | undefined) {
        this.element = element;
        this.name = name;
        this.prefix = prefix;
    }

    public async export(): Promise<void>{
        try {
            const canvas = await html2canvas(this.element[0], {
                backgroundColor:null,
                scale: 1
            });
            const pngImage = canvas.toDataURL();
            this.downloadImage(pngImage, this.name, this.prefix);
        } catch (error) {
            console.error("Exporting failure: " + error);
        }
    }

    private downloadImage(dataUrl: string, name: string, prefix: string | undefined) {
        const link = document.createElement('a');

        if(name === ""){
            name = "nameless";
        }

        name = name.toLowerCase().replaceAll(' ', '-');
        if(prefix != null && prefix !== ""){
            name = prefix.toLowerCase().replaceAll(' ', '-') + '-' + name;
        }

        link.download = `${name}.png`;
        link.href = dataUrl;
        link.click();
    }

}
