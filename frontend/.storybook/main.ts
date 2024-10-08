import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-onboarding",
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@chromatic-com/storybook",
        "@storybook/addon-interactions",
        "@storybook/addon-viewport",
        "@storybook/addon-a11y",
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    docs: {
        // autodocs: "tag",
    },
    staticDirs: ["../public"],
    core: {
        disableTelemetry: true, // 👈 Used to ignore update notifications.
    },
};

export default config;
