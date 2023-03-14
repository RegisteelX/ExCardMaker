export type Coordinate = { x: number, y: number }

declare global{
    interface JQuery {
        setElementPosition(top: number | null, left: number | null, right: number | null, bottom: number | null): JQuery;
        applyStyleIf(cssProp: string, value: string | number, condition: () => boolean): JQuery;
        increasePosition(direction: "top" | "bottom" | "left" | "right", amount: number): JQuery;
    }
}

$.fn.setElementPosition = function (top: number | null, left: number | null, right: number | null, bottom: number | null) {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const cssProperties: any = {};

    if (top !== null && top !== undefined) {
        cssProperties["top"] = top;
    }

    if (left !== null && left !== undefined) {
        cssProperties["left"] = left;
    }

    if (right !== null && right !== undefined) {
        cssProperties["right"] = right;
    }

    if (bottom !== null && bottom !== undefined) {
        cssProperties["bottom"] = bottom;
    }

    this.css(cssProperties);
    return this;
};

$.fn.applyStyleIf = function (cssProp: string, value: string | number, condition: () => boolean) {
    if (condition()) {
        this.css(cssProp, value);
    }
    return this;
};

$.fn.increasePosition = function(direction: "top" | "bottom" | "left" | "right", amount: number) {
    const position = parseInt(this.css(direction).replace("px", ""));

    if(position == null) return this;
    switch (direction) {
        case "top":
            this.css(direction, position - amount);
            return this;
        case "bottom":
            this.css(direction, position + amount);
            return this;
        case "left":
            this.css(direction, position + amount);
            return this;
        case "right":
            this.css(direction, position - amount);
            return this;
    }

    return this;
}

export {};
