import { create } from "zustand";

export type CampBookingInput = {
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
};

export const useCampBookingInputStore = create<CampBookingInput>((set) => ({
    checkInDate: null,
    setCheckInDate: (checkInDate) => set({ checkInDate }),
    checkOutDate: null,
    setCheckOutDate: (checkOutDate) => set({ checkOutDate }),
    adultGuestsCount: 1,
    setAdultGuestsCount: (adultGuestsCount) => set({ adultGuestsCount }),
    childGuestsCount: 0,
    setChildGuestsCount: (childGuestsCount) => set({ childGuestsCount }),
    petsCount: 0,
    setPetsCount: (petsCount) => set({ petsCount }),
}));
