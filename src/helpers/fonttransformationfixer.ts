export function roundCssTransformMatrix(element: HTMLElement): void {
    element.style.transform = "";

    const mx = window.getComputedStyle(element);
    const matrix = mx.getPropertyValue("-webkit-transform") ||
        mx.getPropertyValue("-moz-transform") ||
        mx.getPropertyValue("-ms-transform") ||
        mx.getPropertyValue("-o-transform") ||
        mx.getPropertyValue("transform") || false;
    if (!matrix) {
        return;
    }

    const values = matrix
        .replace(/ |\(|\)|matrix/g, "")
        .split(",")
        .map((value, i) => i > 4 ? Math.ceil(parseFloat(value)) : parseFloat(value));

    element.style.transform = `matrix(${values.join()})`;
}

export function fixAllCssTransformsFor(elementId: string): void{
    const el = document.getElementById(elementId);
    if (!el) {
        return;
    }

    const elements = el.getElementsByTagName('*');
    for (let i = 0; i < elements.length; i++) {
        roundCssTransformMatrix(elements[i] as HTMLElement);
    }

    roundCssTransformMatrix(el);
}
