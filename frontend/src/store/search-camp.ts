import { MapboxSearchResponse } from "@app/hooks/mapbox";
import { create } from "zustand";

export type SearchCampInputStore = {
    location?: MapboxSearchResponse["suggestions"][number] | null;
    setLocation: (
        location: MapboxSearchResponse["suggestions"][number] | null
    ) => void;
    checkInDate: Date | null;
    setCheckInDate: (date: Date | null) => void;
    checkOutDate: Date | null;
    setCheckOutDate: (date: Date | null) => void;
    adultGuestsCount: number;
    setAdultGuestsCount: (count: number) => void;
    childGuestsCount: number;
    setChildGuestsCount: (count: number) => void;
    petsCount: number;
    setPetsCount: (count: number) => void;

    openSearchDrawer: boolean;
    setOpenSearchDrawer: (openSearchDrawer: boolean) => void;
};

export const useSearchCampInputStore = create<SearchCampInputStore>((set) => ({
    // Filters
    location: null,
    setLocation: (location) => set({ location }),
    checkInDate: null,
    setCheckInDate: (checkInDate) => set({ checkInDate }),
    checkOutDate: null,
    setCheckOutDate: (checkOutDate) => set({ checkOutDate }),
    adultGuestsCount: 0,
    setAdultGuestsCount: (adultGuestsCount) => set({ adultGuestsCount }),
    childGuestsCount: 0,
    setChildGuestsCount: (childGuestsCount) => set({ childGuestsCount }),
    petsCount: 0,
    setPetsCount: (petsCount) => set({ petsCount }),

    // Search drawer
    openSearchDrawer: false,
    setOpenSearchDrawer: (openSearchDrawer) => set({ openSearchDrawer }),
}));
