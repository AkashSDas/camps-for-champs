import "@app/styles/globals.css";
import type { AppProps } from "next/app";
import { Bungee, Sora } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { theme } from "@app/lib/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@app/lib/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";

export const headingFont = Bungee({ weight: ["400"], subsets: ["latin"] });
export const bodyFont = Sora({ subsets: ["latin"] });

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function App({ Component, pageProps }: AppProps) {
    const options: StripeElementsOptions = {};

    return (
        <Elements stripe={stripePromise} options={options}>
            <QueryClientProvider client={queryClient}>
                <div
                    className={`${headingFont.className} ${bodyFont.className}`}
                >
                    <ThemeProvider theme={theme}>
                        <Component {...pageProps} />
                        <CssBaseline />
                    </ThemeProvider>
                </div>
            </QueryClientProvider>
        </Elements>
    );
}
