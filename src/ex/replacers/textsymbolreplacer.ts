import {IStringReplacer} from "../../helpers/stringreplacer";

export class TextSymbolReplacer implements IStringReplacer {

    private readonly pattern = /\[\*\]|\[gs\]|\[p\]/g;

    public replace(str: string): string {
        return str.replace(this.pattern, (match: string) => {
            if (match === '[*]' || match === '[gs]') {
                return "<span class='special-icon'>* </span>";
            }
            else if (match === '[p]') {
                return "<span class='special-icon'>p</span>";
            }
            else {
                return match;
            }
        });
    }

}
