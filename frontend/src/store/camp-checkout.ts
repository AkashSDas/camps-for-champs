import { create } from "zustand";
import { CampBookingInput } from "./camp-booking-input";

export type CampCheckoutStore = CampBookingInput;

export const useCampCheckoutStore = create<CampCheckoutStore>((set) => ({
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
}));
