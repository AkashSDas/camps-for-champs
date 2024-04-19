// This JS file is so that we can use JSX and don't have any errors
// and the default export is imported in the preview.ts file (which
// is what storybook looks for)

// import { type Preview } from "@storybook/react";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../src/lib/styles";
import React from "react";
import { Bungee, Sora } from "next/font/google";

export const headingFont = Bungee({ weight: ["400"], subsets: ["latin"] });
const bodyFont = Sora({ subsets: ["latin"] });

// const preview: Preview = {
const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <div className={`${headingFont.className} ${bodyFont.className}`}>
                <ThemeProvider theme={theme}>
                    <Story />
                </ThemeProvider>
            </div>
        ),
    ],
};

export default preview;
