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
