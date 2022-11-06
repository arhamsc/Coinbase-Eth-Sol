import { CacheProvider } from "@emotion/react";
import "../styles/globals.css";
import createEmotionCache from "../utils/createEmotionCache";

const clientSideEmotionCache = createEmotionCache();

function MyApp({
    Component,
    pageProps,
    emotionCache = clientSideEmotionCache,
}) {
    return (
        <CacheProvider value={emotionCache}>
            <Component {...pageProps} />
        </CacheProvider>
    );
}

export default MyApp;
