import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import "../style/global.css";


export const metadata: Metadata = {
  title: 'Maan-Naa - Outfit Recommendation for Your Meetup',
  description: 'Get personalized outfit recommendations for various social situations and cultural contexts. Upload your outfit and receive instant feedback.',
  keywords: ['outfit recommendation', 'dress code', 'cultural etiquette', 'social meetups', 'fashion advice'],
  authors: [{ name: 'EBCHO' }],
  openGraph: {
    title: 'Maan-Naa - Outfit Recommendation for Your Meetup',
    description: 'Get personalized outfit recommendations for various social situations and cultural contexts.',
    url: 'https://nextjs-gemini-one.vercel.app',
    siteName: 'Maan-Naa',
    images: [
      {
        url: 'https://nextjs-gemini-one.vercel.app/og-image.jpg',
        width: 1024,
        height: 1024,
        alt: 'Maan-Naa Outfit Recommendation',
      },
    ],
    locale: 'en-US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maan-Naa - Outfit Recommendation for Your Meetup',
    description: 'Get personalized outfit recommendations for various social situations and cultural contexts.',
    images: ['https://nextjs-gemini-one.vercel.app/twitter-image.jpg'],
  },
  robots: 'index, follow',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
  themeColor: '#ffffff',
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          
            {children}
            <Toaster />

      </body>
    </html>
  );
}
