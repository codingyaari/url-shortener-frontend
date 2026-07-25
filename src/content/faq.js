export const faqItems = [
  {
    question: 'What is a URL shortener?',
    answer:
      'A URL shortener converts a long web address into a short URL that redirects visitors to the original page. Urlbeam also tracks clicks, generates QR codes, and supports custom slugs.',
  },
  {
    question: 'Is Urlbeam free?',
    answer:
      'Yes. Urlbeam includes a free plan with up to 50 short links, custom slugs, QR codes, password protection, and basic analytics. No credit card required.',
  },
  {
    question: 'Can I create custom short links?',
    answer:
      'Yes. Pick a custom slug like /launch so your short URL is memorable for social media, ads, SMS, and link-in-bio pages.',
  },
  {
    question: 'Does Urlbeam track clicks?',
    answer:
      'Yes. See daily click charts plus country, city, device, browser, referrer, and UTM analytics for every short link.',
  },
  {
    question: 'Can I password-protect a short link?',
    answer:
      'Yes. Add a password when you create or edit a link. Visitors unlock the destination before they are redirected.',
  },
  {
    question: 'Does Urlbeam generate QR codes?',
    answer:
      'Yes. Every short link can include a QR code you can download and share on print or digital surfaces. Scans count as clicks in analytics.',
  },
  {
    question: 'What is a link-in-bio page?',
    answer:
      'A link-in-bio page collects your important links in one public profile URL. Urlbeam lets you publish a bio page under /bio/your-username.',
  },
  {
    question: 'How is Urlbeam different from Bitly or TinyURL?',
    answer:
      'Urlbeam focuses on a free, modern workflow: Google sign-in, custom slugs, QR, analytics, passwords, UTM, and bio pages without enterprise lock-in. See pricing for Free, Pro, and Business plans.',
  },
];

export function faqToJsonLd(siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
    url: `${siteUrl}/faq`,
  };
}
