import { create } from "zustand";

type AuthStore = {
    isSignupModalOpen: boolean;
    openSignupModal: () => void;
    closeSignupModal: () => void;
    isLoginModalOpen: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;
};

export const useAuthStore = create<AuthStore>(function (set) {
    return {
        isSignupModalOpen: false,
        openSignupModal: () => set({ isSignupModalOpen: true }),
        closeSignupModal: () => set({ isSignupModalOpen: false }),

        isLoginModalOpen: false,
        openLoginModal: () => set({ isLoginModalOpen: true }),
        closeLoginModal: () => set({ isLoginModalOpen: false }),
    };
});
