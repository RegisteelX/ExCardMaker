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

export function doDivsOverlapWithOffset(div1: JQuery<HTMLElement>, div2: JQuery<HTMLElement>, offset: {top?: number, left?: number, right?: number, bottom?: number} = {}): boolean {
    const div1Pos = div1.offset()!;
    const div1Width = div1.width()!;
    const div1Height = div1.height()!
    const div2Pos = div2.offset()!;
    const div2Width = div2.width()!;
    const div2Height = div2.height()!;

    // Add the offset values to div1's position
    const top = div1Pos.top + (offset.top ?? 0);
    const left = div1Pos.left + (offset.left ?? 0);
    const right = left + div1Width + (offset.right ?? 0);
    const bottom = top + div1Height + (offset.bottom ?? 0);

    const div2Right = div2Pos.left + div2Width;
    const div2Bottom = div2Pos.top + div2Height;

    return (
        left < div2Right &&
        right > div2Pos.left &&
        top < div2Bottom &&
        bottom > div2Pos.top
    );
}
