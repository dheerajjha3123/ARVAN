import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AdminStyles from "@/components/AdminStyles";
import { OverlayProvider } from "@/context/OverlayContext";
import { Theme } from "@radix-ui/themes";
import QueryProvider from "@/lib/queryclient";
import { CartProvider } from "@/context/CartContext";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers";
import RouteChangeTracker from "@/components/RouteChangeTracker";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "The Arvan",
  description:
    "Our Top Selling Products · LOOK WHITE · LIFE IS GOOD · A4 WHITE · A4 BLACK · FANCY · LOOK (SKY BLUE ) · JUNGLE WALKER · RED DRAGON.",
  metadataBase: process.env.NEXT_PUBLIC_FRONTEND_URL ? new URL(process.env.NEXT_PUBLIC_FRONTEND_URL) : undefined,
  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "The Arvan",
    description:
      "Our Top Selling Products · LOOK WHITE · LIFE IS GOOD · A4 WHITE · A4 BLACK · FANCY · LOOK (SKY BLUE ) · JUNGLE WALKER · RED DRAGON",
    url: "thearvan.com",
    siteName: "The Arvan",
    locale: "en_US",
    images: [
      {
        url: "/logo/logo.png",
        width: 800,
        height: 600,
      },
      {
        url: "/logo/logo.png",
        width: 1800,
        height: 1600,
        alt: "The Arvan",
      },
    ],
    type: "website",
  },
};

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" className="dark">
        <head>
          <meta name="color-scheme" content="dark" />
          <meta
            name="google-site-verification"
            content="TMra_J8xSUHe1N4BIr2tBGpOiJV-7LITz62767WnPhU"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://res.cloudinary.com/dficko9l8/image/upload/v1743685582/Mobile_wcue4b.png"
            as="image"
            type="image/png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <QueryProvider>
            <Theme>
              <AdminStyles />
              <Suspense fallback={null}>
                <RouteChangeTracker />
              </Suspense>
              <OverlayProvider>
                <CartProvider>{children}</CartProvider>
              </OverlayProvider>
            </Theme>
          </QueryProvider>
          <Providers />

          <script dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1202443618041987');
              fbq('track', 'PageView');
            `
          }} />
          <noscript><img height="1" width="1" style={{display: "none"}}
            src="https://www.facebook.com/tr?id=1202443618041987&ev=PageView&noscript=1"
            alt=""
          /></noscript>

          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-T7FDK3D6"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}></iframe>
          </noscript>
        </body>
      </html>
    </SessionProvider>
  );
}