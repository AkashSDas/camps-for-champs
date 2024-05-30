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

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(process.env.NEXT_STRIPE_PUBLISHABLE_KEY!);

// TODO: use Element in payment form wrapper

export default function App({ Component, pageProps }: AppProps) {
    // const options: StripeElementsOptions = {
    //     clientSecret: process.env.NEXT_STRIPE_CLIENT_SECRET!, payment intent
    // };

    return (
        // <Elements stripe={stripePromise} options={options}>
        <QueryClientProvider client={queryClient}>
            <div className={`${headingFont.className} ${bodyFont.className}`}>
                <ThemeProvider theme={theme}>
                    <Component {...pageProps} />
                    <CssBaseline />
                </ThemeProvider>
            </div>
        </QueryClientProvider>
        // </Elements>
    );
}
