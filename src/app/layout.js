import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { ReduxProvider } from "@/store/ReduxProvider";
import { ToastProvider } from "@/components/ToastContainer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { buildPageMetadata, SITE_NAME, SITE_TAGLINE, getSiteUrl } from "@/lib/seo";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  ...buildPageMetadata({
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    path: '/',
  }),
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/urlbeam-logo.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [{ url: '/urlbeam-logo.png' }],
    shortcut: ['/icon.svg'],
  },
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#070b12" },
  ],
};

const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('theme-preference');
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  const siteUrl = getSiteUrl();

  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className="antialiased bg-[var(--paper)] text-[var(--ink)]">
        <GoogleAnalytics gaId="G-1V99MD4RLP" />
        <SessionProvider>
          <ReduxProvider>
            <ThemeProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ThemeProvider>
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
