import type { AppProps } from "next/app";
import ProviderWrapper from "../store/ProviderWrapper";
import "../app/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProviderWrapper>
      <Component {...pageProps} />
    </ProviderWrapper>
  );
}
