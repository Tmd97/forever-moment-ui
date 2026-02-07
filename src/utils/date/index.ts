import { format } from 'date-fns';

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export { monthNames };

export const formatDate = (date: string | Date | number) => {
    let rawDate = new Date(date);
    let year = rawDate.getFullYear();
    let month = monthNames[rawDate.getMonth()];
    let day = rawDate.getDate();
    return `${day}-${month}-${year}`;
};

export const dateFormatTo = (dateStr: string | Date | number, formatStr: string) => {
    try {
        // date-fns format tokens are slightly different from moment
        // e.g., YYYY -> yyyy, DD -> dd
        // We'll trust the caller to use date-fns compatible strings or we might need a mapping if strict moment compat is required
        return format(new Date(dateStr), formatStr);
    } catch (error) {
        return String(dateStr);
    }
};
