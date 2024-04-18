import "@app/styles/globals.css";
import type { AppProps } from "next/app";
import { Bungee, Sora } from "next/font/google";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { theme } from "@app/lib/styles";

const headingFont = Bungee({ weight: ["400"], subsets: ["latin"] });
const bodyFont = Sora({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={`${headingFont.className} ${bodyFont.className}`}>
            <ThemeProvider theme={theme}>
                <Component {...pageProps} />
                <CssBaseline />
            </ThemeProvider>
        </div>
    );
}
