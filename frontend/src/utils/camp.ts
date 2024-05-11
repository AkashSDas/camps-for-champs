import { MapboxBBox } from "@app/hooks/mapbox";
import { z } from "zod";

export function getImagePathForFeature(label: string): string {
    let path: string = "bulb-emoji";
    console.log({ label });

    switch (label) {
        case "River View":
            path = "river-emoji";
            break;
        case "Mountain View":
            path = "mountain-emoji";
            break;
        case "Lake View":
            path = "boat1-emoji";
            break;
        case "Forest View":
            path = "forest-emoji";
            break;
        case "RV Friendly":
            path = "car1-emoji";
            break;
        case "Pet Friendly":
            path = "dog-on-leash-emoji";
            break;
        case "Family Friendly":
            path = "family-emoji";
            break;
        case "Beach Access":
            path = "beach-emoji";
            break;
        case "Wi-Fi":
            path = "network-emoji";
            break;
        case "Toilet":
            path = "toilet-emoji";
            break;
        case "Swimming pool":
            path = "diving-emoji";
            break;
        case "Shower":
            path = "shower-emoji";
            break;
        case "Pet-friendly":
            path = "dog-on-leash-emoji";
            break;
        case "Parking":
            path = "car2-emoji";
            break;
        case "Kitchen":
            path = "cooking-emoji";
            break;
        case "Fireplace":
            path = "fire-emoji";
            break;
        case "Electricity":
            path = "plug-emoji";
            break;
        case "BBQ":
            path = "meat-emoji";
            break;
        case "Swimming Spots":
            path = "swimming-emoji";
            break;
        case "Hiking Trails":
            path = "hiking-emoji";
            break;
        case "Fishing Spots":
            path = "fishing-emoji";
            break;
        case "Biking Trails":
            path = "cycling-emoji";
            break;
        default:
            path = "bulb-emoji";
            break;
    }

    return `/figmoji/${path}.png`;
}

const searchParamsSchema = z
    .object({
        location: z.string().optional(),
        checkInDate: z.string().optional(),
        checkOutDate: z.string().optional(),
        adultGuestsCount: z.string().optional(),
        childGuestsCount: z.string().optional(),
        petsCount: z.string().optional(),
    })
    .transform((data) => {
        return {
            location: (data.location &&
            data.location !== "null" &&
            data.location !== "undefined"
                ? data.location.split(",").map(parseFloat)
                : undefined) as MapboxBBox | undefined,
            checkInDate:
                data.checkInDate &&
                data.checkInDate !== "null" &&
                data.checkInDate !== "undefined"
                    ? new Date(data.checkInDate)
                    : undefined,
            checkOutDate:
                data.checkOutDate &&
                data.checkOutDate !== "null" &&
                data.checkOutDate !== "undefined"
                    ? new Date(data.checkOutDate)
                    : undefined,
            adultGuestsCount:
                data.adultGuestsCount &&
                data.adultGuestsCount !== "null" &&
                data.adultGuestsCount !== "undefined"
                    ? parseInt(data.adultGuestsCount, 10)
                    : 0,
            childGuestsCount:
                data.childGuestsCount &&
                data.childGuestsCount !== "null" &&
                data.childGuestsCount !== "undefined"
                    ? parseInt(data.childGuestsCount, 10)
                    : 0,
            petsCount:
                data.petsCount &&
                data.petsCount !== "null" &&
                data.petsCount !== "undefined"
                    ? parseInt(data.petsCount, 10)
                    : 0,
        };
    });

export function transformQueryParamsToSearchValues(
    query: Record<string, string>
): z.infer<typeof searchParamsSchema> {
    let {
        location,
        checkInDate,
        checkOutDate,
        adultGuestsCount,
        childGuestsCount,
        petsCount,
    } = query;

    let searchValues = searchParamsSchema.parse({
        location,
        checkInDate,
        checkOutDate,
        adultGuestsCount,
        childGuestsCount,
        petsCount,
    });

    return searchValues;
}
