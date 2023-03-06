import domtoimage from 'dom-to-image';

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
            await domtoimage
                .toPng(this.element[0], { bgcolor: undefined, cacheBust: true })
                .then((dataUrl) => {
                    this.downloadImage(dataUrl, this.name, this.prefix);
            });
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
