export const SITE_NAME = 'Urlbeam';
export const SITE_TAGLINE = 'Short links that convert';
export const SITE_OPERATOR = 'CodingYari';
export const SITE_CONTACT_EMAIL = 'support@codingyari.com';
export const SITE_DOMAIN = 'shortener.codingyari.com';
export const SITE_DESCRIPTION =
  'Urlbeam is a free URL shortener with custom short links, QR codes, click analytics, password protection, UTM tracking, and link-in-bio pages. Shorten URLs, track every click, and share branded links.';

export const SEO_KEYWORDS = [
  'url shortener',
  'shorten url',
  'short url',
  'link shortener',
  'free url shortener',
  'custom short links',
  'branded short links',
  'qr code generator',
  'link analytics',
  'click tracking',
  'url short',
  'shortener',
  'link in bio',
  'short link',
  'tiny url alternative',
  'bitly alternative',
  'trackable links',
  'password protected links',
  'utm builder',
  'campaign links',
  'urlbeam',
];

export function getSiteUrl() {
  let fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  fromEnv = String(fromEnv).trim().replace(/\/$/, '');

  // Fix common misconfig: "https:/domain" or "http:/domain"
  fromEnv = fromEnv.replace(/^(https?):\/(?!\/)/i, '$1://');

  // Add https if protocol is missing (e.g. "shortener.codingyari.com")
  if (!/^https?:\/\//i.test(fromEnv)) {
    fromEnv = `https://${fromEnv.replace(/^\/+/, '')}`;
  }

  try {
    const parsed = new URL(fromEnv);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return 'http://localhost:3000';
  }
}

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '/',
  noIndex = false,
  keywords = SEO_KEYWORDS,
} = {}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: `${siteUrl}/og.png`,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${siteUrl}/og.png`],
    },
    category: 'technology',
  };
}
