import "@app/styles/globals.css";
import type { AppProps } from "next/app";

export default function App(props: AppProps): React.JSX.Element {
    const { Component, pageProps } = props;
    return <Component {...pageProps} />;
}
