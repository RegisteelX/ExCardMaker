import {IStringReplacer} from "../../helpers/stringreplacer";

//Only Gold Star icon is used in EX era.
export class TextSymbolReplacer implements IStringReplacer {

    private readonly pattern = /\[\*\]|\[gs\]/g;

    public replace(str: string): string {
        return str.replace(this.pattern, "<i class='special-icon'>* </i>");
    }

}
