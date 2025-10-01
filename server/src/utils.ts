
export const mapObject = <T, R>(
    obj: Record<string | number, T>,
    fn: (key: string, value: T, index: number) => R
): R[] => {
    return Object.entries(obj).map(([key, value], index) =>
        fn(key, value, index)
    );
}