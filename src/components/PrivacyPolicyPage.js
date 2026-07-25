import { LegalPage, LegalSection } from '@/components/LegalPage';
import {
  SITE_CONTACT_EMAIL,
  SITE_DOMAIN,
  SITE_NAME,
  SITE_OPERATOR,
} from '@/lib/seo';

export function PrivacyPolicyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated="July 25, 2026">
      <LegalSection title="1. Who we are">
        <p>
          {SITE_NAME} (“{SITE_NAME}”, “we”, “us”) is a free URL shortener operated by{' '}
          {SITE_OPERATOR}. The service is available at{' '}
          <strong className="text-[var(--ink)]">{SITE_DOMAIN}</strong> and related subdomains.
        </p>
        <p>
          Questions about this policy: email{' '}
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-700 text-[var(--signal)] hover:underline">
            {SITE_CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="2. Information we collect">
        <p>
          <strong className="text-[var(--ink)]">Account information.</strong> When you sign in with
          Google, we receive your name, email address, profile image, and Google account identifier
          so we can create and authenticate your {SITE_NAME} account.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Link &amp; content data.</strong> We store the
          destination URLs you shorten, custom slugs, optional notes, tags, UTM fields, expiry
          settings, password hashes for protected links, QR-related link data, and public bio
          profile details you choose to publish.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Analytics data.</strong> When someone opens a short
          link or bio link, we may record click time, approximate location (country/city derived
          from IP), device/browser type, referrer, and UTM parameters. We do this to show you link
          performance in your dashboard.
        </p>
        <p>
          <strong className="text-[var(--ink)]">Technical data.</strong> We may collect standard
          server logs (IP address, user agent, timestamps) needed to operate, secure, and debug the
          service.
        </p>
      </LegalSection>

      <LegalSection title="3. How we use information">
        <p>We use data to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Provide URL shortening, redirects, QR codes, analytics, and link-in-bio pages</li>
          <li>Authenticate users and protect accounts</li>
          <li>Enforce password-protected and expired links</li>
          <li>Improve reliability, prevent abuse, and fix bugs</li>
          <li>Respond to support requests you send us</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </LegalSection>

      <LegalSection title="4. Cookies and sign-in">
        <p>
          {SITE_NAME} uses cookies and similar technologies required for Google sign-in (NextAuth
          sessions) and to keep you logged into the dashboard. These are essential for the product
          to work. We do not use third-party advertising cookies on {SITE_NAME}.
        </p>
      </LegalSection>

      <LegalSection title="5. Sharing and processors">
        <p>We share data only as needed to run the service, for example:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong className="text-[var(--ink)]">Google</strong> — for OAuth sign-in
          </li>
          <li>
            <strong className="text-[var(--ink)]">Hosting &amp; database providers</strong> — to
            store account, link, and analytics data securely
          </li>
        </ul>
        <p>
          We may disclose information if required by law, or to protect {SITE_NAME},{' '}
          {SITE_OPERATOR}, users, or the public from fraud, abuse, or security threats.
        </p>
      </LegalSection>

      <LegalSection title="6. Public content">
        <p>
          Short links redirect publicly. Bio pages you publish are public by design. Do not put
          secrets in destinations, notes you share, or bio content you are not comfortable making
          public. Password protection helps gate destinations, but the short URL itself may still be
          visible if shared.
        </p>
      </LegalSection>

      <LegalSection title="7. Data retention">
        <p>
          We keep account and link data while your account is active. Click analytics are retained
          to power your dashboards and may be aggregated or deleted over time as needed for storage
          and performance. You may request account deletion by contacting{' '}
          <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-700 text-[var(--signal)] hover:underline">
            {SITE_CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="8. Security">
        <p>
          We use industry-standard practices such as encrypted connections (HTTPS), hashed passwords
          for protected links, and access controls on our systems. No method of transmission or
          storage is 100% secure; please use strong account practices and avoid placing highly
          sensitive material behind a short link unless necessary.
        </p>
      </LegalSection>

      <LegalSection title="9. Children’s privacy">
        <p>
          {SITE_NAME} is not directed at children under 13 (or the minimum age required in your
          region). We do not knowingly collect personal information from children.
        </p>
      </LegalSection>

      <LegalSection title="10. Your choices">
        <p>
          You can update or delete many of your links from the dashboard, sign out at any time, and
          contact us to request access, correction, or deletion of personal data where applicable
          law provides those rights.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes">
        <p>
          We may update this Privacy Policy as {SITE_NAME} evolves. The “Last updated” date at the
          top will change when we do. Continued use of the service after updates means you accept
          the revised policy.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
