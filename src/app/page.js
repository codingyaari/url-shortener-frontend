import { JsonLd } from '@/components/JsonLd';
import { HomePage } from '@/components/HomePage';
import { buildPageMetadata, getSiteUrl, SITE_DESCRIPTION, SITE_NAME, SEO_KEYWORDS } from '@/lib/seo';

export const metadata = buildPageMetadata({
  title: `${SITE_NAME} — Free URL Shortener | Custom Short Links, QR Codes & Analytics`,
  description: SITE_DESCRIPTION,
  path: '/',
});

export default function Page() {
  const siteUrl = getSiteUrl();

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: SITE_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: siteUrl,
    description: SITE_DESCRIPTION,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'URL shortener',
      'Custom short links',
      'QR code generator',
      'Click analytics',
      'Password protected links',
      'Link in bio pages',
      'UTM tracking',
    ],
    keywords: SEO_KEYWORDS.join(', '),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a URL shortener?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A URL shortener turns long web addresses into short, shareable links. Urlbeam also adds analytics, QR codes, passwords, and custom slugs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Urlbeam free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Urlbeam includes a free plan with up to 50 short links, custom slugs, QR codes, and basic analytics. No credit card required.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I track clicks on short links?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Urlbeam tracks clicks over time plus countries, cities, devices, browsers, referrers, and UTM sources.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={websiteLd} />
      <JsonLd data={softwareLd} />
      <JsonLd data={faqLd} />
      <HomePage />
    </>
  );
}
