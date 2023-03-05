import {IStringReplacer} from "../../helpers/stringreplacer";

export class ItalicTextReplacer implements IStringReplacer {

    private readonly pattern = /\((.*)\)/ig;

    public replace(str: string): string {
        return str.replace(this.pattern, "<i class='benched-weakness-resistance-text'>($1)</i>");
    }

}
