import { useEffect, useState } from "react";

export const useDebounce = (value: any, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}






export const mapObject = <T, R>(
    obj: Record<string | number, T>,
    fn: (key: string, value: T, index: number) => R
): R[] => {
    return Object.entries(obj).map(([key, value], index) =>
        fn(key, value, index)
    );
}