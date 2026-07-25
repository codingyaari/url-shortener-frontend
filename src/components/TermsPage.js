import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/LegalPage';
import {
  SITE_CONTACT_EMAIL,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_OPERATOR,
} from '@/lib/seo';

export function TermsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Terms of Service" updated="July 25, 2026">
      <LegalSection title="1. Agreement">
        <p>
          These Terms of Service (“Terms”) govern your use of {SITE_NAME}, a URL shortener and
          related tools (short links, QR codes, analytics, password links, UTM fields, and
          link-in-bio pages) operated by {SITE_OPERATOR} at{' '}
          <strong className="text-[var(--ink)]">{SITE_DOMAIN}</strong>.
        </p>
        <p>
          By creating an account or using {SITE_NAME}, you agree to these Terms and our{' '}
          <Link href="/privacy" className="font-700 text-[var(--signal)] hover:underline">
            Privacy Policy
          </Link>
          . If you do not agree, do not use the service.
        </p>
      </LegalSection>

      <LegalSection title="2. The service">
        <p>
          {SITE_NAME} lets you create short URLs that redirect to destinations you provide, view
          click analytics, generate QR codes, optionally password-protect or expire links, and
          publish a public bio page. Features and plan limits (including the free plan of up to 50
          links) may change as we improve the product. Pricing details are described on the{' '}
          <Link href="/pricing" className="font-700 text-[var(--signal)] hover:underline">
            Pricing
          </Link>{' '}
          page.
        </p>
      </LegalSection>

      <LegalSection title="3. Accounts">
        <p>
          You may sign in with Google. You are responsible for activity under your account and for
          keeping access to your Google account secure. Provide accurate information and notify us
          at{' '}
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-700 text-[var(--signal)] hover:underline">
            {SITE_CONTACT_EMAIL}
          </a>{' '}
          if you suspect unauthorized use.
        </p>
      </LegalSection>

      <LegalSection title="4. Acceptable use">
        <p>You agree not to use {SITE_NAME} to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Distribute malware, phishing, scams, or deceptive content</li>
          <li>Infringe intellectual property, privacy, or other rights</li>
          <li>Host or promote illegal activity, exploitation, or hate content</li>
          <li>Spam, abuse redirects, or attempt to disrupt or reverse-engineer the service</li>
          <li>Misrepresent affiliation with {SITE_NAME} or {SITE_OPERATOR}</li>
        </ul>
        <p>
          We may suspend or remove links, bio pages, or accounts that violate these Terms or pose
          risk to users or the platform — with or without notice when we believe harm is likely.
        </p>
      </LegalSection>

      <LegalSection title="5. Your content and links">
        <p>
          You retain ownership of the destinations and content you submit. You grant{' '}
          {SITE_NAME} / {SITE_OPERATOR} a limited license to store, process, and display that
          content as needed to operate redirects, analytics, QR codes, and bio pages.
        </p>
        <p>
          You are solely responsible for the websites and materials your short links point to, and
          for ensuring you have the right to share them. Public bio pages and short URLs may be
          accessible to anyone who has the link.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual property">
        <p>
          {SITE_NAME}, its branding, interface, and software are owned by {SITE_OPERATOR} or its
          licensors. You may not copy, resell, or exploit the service except as allowed through
          normal use of the product.
        </p>
      </LegalSection>

      <LegalSection title="7. Availability and changes">
        <p>
          We aim for reliable redirects and dashboards but do not guarantee uninterrupted uptime.
          Features may be added, changed, or removed. We may modify these Terms; the “Last updated”
          date will reflect changes. Continued use after updates constitutes acceptance.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          {SITE_NAME} is provided “as is” and “as available” without warranties of any kind,
          express or implied, including merchantability, fitness for a particular purpose, and
          non-infringement. We do not warrant that short links will always resolve, that analytics
          are complete or error-free, or that the service will meet every business requirement.
        </p>
      </LegalSection>

      <LegalSection title="9. Limitation of liability">
        <p>
          To the fullest extent permitted by law, {SITE_OPERATOR} and {SITE_NAME} are not liable
          for indirect, incidental, special, consequential, or punitive damages, or any loss of
          profits, data, goodwill, or business opportunities arising from your use of the service.
          Our total liability for any claim relating to {SITE_NAME} is limited to the greater of
          (a) the amount you paid us for the service in the 12 months before the claim or (b) USD
          $50 if you use only the free plan.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          You may stop using {SITE_NAME} at any time. We may suspend or terminate access if you
          breach these Terms or if we discontinue the service. Provisions that should survive
          (ownership, disclaimers, liability limits) remain in effect.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          For terms questions or legal notices related to {SITE_NAME}:{' '}
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-700 text-[var(--signal)] hover:underline">
            {SITE_CONTACT_EMAIL}
          </a>
          . Operated by {SITE_OPERATOR} · {SITE_DOMAIN}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
