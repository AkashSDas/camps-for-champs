// This JS file is so that we can use JSX and don't have any errors
// and the default export is imported in the preview.ts file (which
// is what storybook looks for)

// import { type Preview } from "@storybook/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../src/lib/styles";
import React, { useMemo } from "react";
import { Bungee, Sora } from "next/font/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@app/lib/react-query";

export const headingFont = Bungee({ weight: ["400"], subsets: ["latin"] });
const bodyFont = Sora({ subsets: ["latin"] });

const THEMES = {
    light: theme,
    dark: theme,
};

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
        (Story, context) => {
            const { theme: themeKey } = context.globals;
            // only recompute the theme if the themeKey changes
            const theme = useMemo(
                () => THEMES[themeKey] ?? THEMES["light"],
                [themeKey]
            );

            return (
                <QueryClientProvider client={queryClient}>
                    <div
                        className={`${headingFont.className} ${bodyFont.className}`}
                    >
                        <ThemeProvider theme={theme}>
                            <Story />
                        </ThemeProvider>
                    </div>

                    <CssBaseline />
                </QueryClientProvider>
            );
        },
    ],
};

export default preview;

export const globalTypes = {
    theme: {
        name: "Theme",
        title: "Theme",
        description: "Theme for your components",
        defaultValue: "light",
        toolbar: {
            icon: "paintbrush",
            dynamicTitle: true,
            items: [
                { value: "light", left: "☀️", title: "Light mode" },
                { value: "dark", left: "🌙", title: "Dark mode" },
            ],
        },
    },
};
