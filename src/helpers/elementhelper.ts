export function doDivsOverlap(div1: JQuery<HTMLElement>, div2: JQuery<HTMLElement>): boolean {
    const div1Pos = div1.offset()!;
    const div1Width = div1.width()!;
    const div1Height = div1.height()!
    const div2Pos = div2.offset()!;
    const div2Width = div2.width()!;
    const div2Height = div2.height()!;

    const div1Right = div1Pos.left + div1Width;
    const div1Bottom = div1Pos.top + div1Height;
    const div2Right = div2Pos.left + div2Width;
    const div2Bottom = div2Pos.top + div2Height;

    return (
        div1Pos.left < div2Right &&
        div1Right > div2Pos.left &&
        div1Pos.top < div2Bottom &&
        div1Bottom > div2Pos.top
    );
}
