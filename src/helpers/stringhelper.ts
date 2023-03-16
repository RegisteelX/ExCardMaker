export function isNullOrEmpty(str: string | null | undefined): str is null | undefined | '' {
    return str === null || str === undefined || str === '';
}
