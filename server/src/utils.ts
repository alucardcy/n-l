
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const mapObject = <T, R>(
    obj: Record<string | number, T>,
    fn: (key: string, value: T, index: number) => R
): R[] => {
    return Object.entries(obj).map(([key, value], index) =>
        fn(key, value, index)
    );
}

export const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    let currentDate = dayjs(new Date(startDate)); // strict parse as local
    const lastDate = dayjs(new Date(endDate)); // strict parse as local


    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate, 'day')) {
        dates.push(currentDate.format("YYYY-MM-DD"));
        currentDate = currentDate.add(1, 'day');
    }

    return dates;
}