import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://oraculo.ar'),
  title: {
    default: "Oráculo.ar - Mercados Predictivos de Argentina",
    template: "%s | Oráculo.ar"
  },
  description: "Explora mercados predictivos y de pronósticos sobre Argentina en tiempo real. Predicciones sobre política, economía, deportes y más. Datos actualizados de Polymarket.",
  keywords: [
    "mercados predictivos",
    "predicciones Argentina",
    "pronósticos",
    "mercados de predicción",
    "Polymarket Argentina",
    "apuestas predictivas",
    "mercados de pronóstico",
    "predicción política Argentina",
    "predicción económica Argentina"
  ],
  authors: [{ name: "Oráculo.ar" }],
  creator: "Oráculo.ar",
  publisher: "Oráculo.ar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://oraculo.ar",
    siteName: "Oráculo.ar",
    title: "Oráculo.ar - Mercados Predictivos de Argentina",
    description: "Explora mercados predictivos y de pronósticos sobre Argentina en tiempo real. Predicciones sobre política, economía, deportes y más.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Oráculo.ar - Mercados Predictivos de Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oráculo.ar - Mercados Predictivos de Argentina",
    description: "Explora mercados predictivos y de pronósticos sobre Argentina en tiempo real. Predicciones actualizadas.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: 'https://oraculo.ar',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://oraculo.ar/#organization',
        name: 'Oráculo.ar',
        url: 'https://oraculo.ar',
        logo: {
          '@type': 'ImageObject',
          url: 'https://oraculo.ar/og-image.png',
        },
        description: 'Mercados predictivos de Argentina en tiempo real',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://oraculo.ar/#website',
        url: 'https://oraculo.ar',
        name: 'Oráculo.ar',
        description: 'Mercados predictivos y de pronósticos sobre Argentina',
        publisher: {
          '@id': 'https://oraculo.ar/#organization',
        },
        inLanguage: 'es-AR',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://oraculo.ar/?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-J24JX1HCND" />
      </body>
    </html>
  );
}
