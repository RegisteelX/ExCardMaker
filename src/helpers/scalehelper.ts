export function getHeightScale(): number{
    const BASE_HEIGHT = 1440;
    return screen.height / BASE_HEIGHT;
}

export function getWidthScale(): number{
    const BASE_WIDTH = 2560;
    return screen.width / BASE_WIDTH;
}
