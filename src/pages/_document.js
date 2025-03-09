import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ✅ Favicon'ų palaikymas visiems įrenginiams */}
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* ✅ Open Graph (Facebook, LinkedIn, Discord preview) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Nord Balticum - Premium Web3 Banking" />
        <meta property="og:description" content="Secure, fast, and luxury Web3 banking experience with Nord Balticum." />
        <meta property="og:image" content="/logo-large.png" />
        <meta property="og:url" content="https://nordbalticum.com" />
        <meta property="og:site_name" content="Nord Balticum" />

        {/* ✅ Twitter kortelės optimizacija */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nord Balticum - Premium Web3 Banking" />
        <meta name="twitter:description" content="Secure, fast, and luxury Web3 banking experience with Nord Balticum." />
        <meta name="twitter:image" content="/logo-large.png" />
        <meta name="twitter:url" content="https://nordbalticum.com" />

        {/* ✅ Google SEO */}
        <meta name="description" content="Nord Balticum - the ultimate Web3 banking experience. Secure, premium, and seamless crypto & fiat payments." />
        <meta name="keywords" content="Nord Balticum, Web3, Crypto Banking, Secure Wallet, Crypto Payments" />
        <meta name="author" content="Nord Balticum" />
      </Head>
      <body style={{ background: "transparent" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
