export class VersionControl {
    private readonly FOOTER_TEXT: string = "BETA v{{MAJOR}}.{{MINOR}}.{{PATCH}} | Templates by <a href=\"https://www.deviantart.com/metagross101\">metagross101</a> | Edited by RegisteelX";
    private readonly TRADEMARK_TEXT: string = "Pokémon is a registered trademark of Nintendo, Creatures, Game Freak and The Pokémon Company. EX-CardMaker is not affiliated with, endorsed, sponsored, or specifically approved by Nintendo, Creatures, Game Freak or The Pokémon Company.";

    private readonly majorVersion: number;
    private readonly minorVersion: number;
    private readonly patchVersion: number;

    constructor(major: number, minor: number, patch: number) {
        this.majorVersion = major;
        this.minorVersion = minor;
        this.patchVersion = patch;
    }

    private getVersionString = (): string => {
        return `v${this.majorVersion}.${this.minorVersion}.${this.patchVersion}`;
    };

    public createFooter(): void {
        const versionString = this.getVersionString();
        const text = this.FOOTER_TEXT
            .replace("{{MAJOR}}", this.majorVersion.toString())
            .replace("{{MINOR}}", this.minorVersion.toString())
            .replace("{{PATCH}}", this.patchVersion.toString())
            .replace("{{VERSION}}", versionString);

        const footer = $("footer");
        const footerText = $("<p>").html(text);
        const trademarkText = $("<p>").css("font-size", 12).text(this.TRADEMARK_TEXT);

        footer.append(footerText, trademarkText);
    };

    public replaceScriptVersion(): void{
        const script = $("#main-script");
        script.attr("src", script.attr("src")!
            .replace("{{MAJOR}}", this.majorVersion.toString())
            .replace("{{MINOR}}", this.minorVersion.toString())
            .replace("{{PATCH}}", this.patchVersion.toString()))
    }
}
