type ResultDateTimeStrFormat = "mm dd, yyyy" | "hh:mm am/pm";

/**
 * Convert a date string to a formatted date string.
 */
export function formatDateTime(
    date: string,
    format: ResultDateTimeStrFormat
): string {
    console.log({ date });

    switch (format) {
        case "mm dd, yyyy":
            return new Date(date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        case "hh:mm am/pm":
            const result = new Date(date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
            });
            console.log({ result });
            return result;
        default:
            throw new Error("Invalid format");
    }
}
