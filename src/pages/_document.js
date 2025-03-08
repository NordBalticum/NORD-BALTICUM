import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* 🔥 Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* 🔥 Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* 🔥 Safari Pinned Tab Icon */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#FFD700" />

        {/* 🔥 Theme Color */}
        <meta name="theme-color" content="#0A1F44" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
