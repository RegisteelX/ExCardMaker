import {AbstractElementDrawer} from "./abstractelementdrawer";
import {ImagePaster} from "../../helpers/imagepaster";

export class MainImageDrawer extends AbstractElementDrawer{

    public async drawElement(): Promise<void> {
        const imageCanvas = $("<canvas id='imageCanvas' width='609' height='377'></canvas>")
        const imagePaster = new ImagePaster(imageCanvas[0] as HTMLCanvasElement);
        imagePaster.bindListener();
        imageCanvas.setElementPosition(107, 69, null, null).appendTo(this.root);
    }

}
