import { Link } from 'react-router-dom';
import './LegalPage.css';

const LegalShell = ({ title, description, toc = [], children }) => (
  <main id="main-content" className="legal-page">
    <div className="lp-hero">
      <div className="lp-hero-inner">
        <Link to="/" className="lp-back">← Return to Academy</Link>
        <h1 className="lp-title">{title}</h1>
        <p className="lp-desc">{description}</p>
        <div className="lp-meta">
          {['Solvagence Global AI Academy','DIFC, Dubai, UAE','Effective: 1 July 2026','Last reviewed: May 2026'].map(m => (
            <span key={m} className="lp-meta-item">{m}</span>
          ))}
        </div>
      </div>
    </div>
    <div className="lp-body">
      {toc.length > 0 && (
        <aside className="lp-toc" aria-label="Contents">
          <div className="lp-toc-head">Contents</div>
          <ul>{toc.map(i => <li key={i.href}><a href={i.href}>{i.label}</a></li>)}</ul>
        </aside>
      )}
      <article className="lp-content">{children}</article>
    </div>
  </main>
);

const ACAD = 'mailto:academy@solvagence.com?subject=Privacy%20Enquiry&body=Name%3A%20%0AEnquiry%3A%20';

export const PrivacyPage = () => (
  <LegalShell title="Privacy Policy"
    description="How Solvagence Global AI Academy collects, uses, and protects your personal data — UAE PDPL, DIFC DPL, GDPR compliant."
    toc={[{href:'#p1',label:'1. Who We Are'},{href:'#p2',label:'2. Data We Collect'},{href:'#p3',label:'3. How We Use It'},{href:'#p4',label:'4. Legal Basis'},{href:'#p5',label:'5. Sharing'},{href:'#p6',label:'6. Retention'},{href:'#p7',label:'7. Your Rights'},{href:'#p8',label:'8. Contact'}]}>
    <div className="lp-note">Compliant with <strong>UAE Federal Law No. 45 of 2021 (PDPL)</strong>, <strong>DIFC Data Protection Law 2020</strong>, and EU GDPR (for EEA participants).</div>
    <h2 id="p1">1. Who We Are</h2>
    <p><strong>Data Controller:</strong> Solvagence Global AI Academy (trading name of Solvagence Ltd)<br/><strong>Address:</strong> DIFC, Dubai, UAE<br/><strong>Contact:</strong> <a href={ACAD}>academy@solvagence.com</a></p>
    <h2 id="p2">2. Data We Collect</h2>
    <h3>Enrollment Data</h3>
    <ul><li>Full name, work email, phone, country</li><li>Job title, organisation, industry</li><li>Years of experience, qualification, LinkedIn URL (optional)</li></ul>
    <h3>Payment Data</h3>
    <p>Billing name and address only. Card details processed by Stripe (PCI DSS Level 1). We never store card numbers.</p>
    <h3>Technical Data</h3>
    <ul><li>IP address, browser type, pages visited</li><li>Language preference: <code>sga-lang</code> in localStorage (no personal data)</li></ul>
    <h2 id="p3">3. How We Use Your Data</h2>
    <table className="lp-table"><thead><tr><th>Purpose</th><th>Basis</th></tr></thead><tbody>
      <tr><td>Processing and confirming enrollment</td><td>Contract performance</td></tr>
      <tr><td>Sending confirmations and programme materials</td><td>Contract performance</td></tr>
      <tr><td>Managing invoicing and refunds</td><td>Legal obligation</td></tr>
      <tr><td>Responding to enquiries</td><td>Legitimate interest</td></tr>
      <tr><td>Complying with UAE law and DIFC regulations</td><td>Legal obligation</td></tr>
      <tr><td>Marketing updates (where consented)</td><td>Consent</td></tr>
    </tbody></table>
    <h2 id="p4">4. Legal Basis</h2>
    <ul><li><strong>Contract performance:</strong> Fulfilling your enrollment agreement</li><li><strong>Legal obligation:</strong> UAE law, DIFC regulations, VAT obligations</li><li><strong>Legitimate interest:</strong> Improving services, fraud prevention</li><li><strong>Consent:</strong> Marketing communications (withdrawable at any time)</li></ul>
    <h2 id="p5">5. Data Sharing</h2>
    <p>We do not sell or trade your data. Shared only with: programme faculty (delivery), Stripe (payment), email provider (confirmations), regulatory authorities (where legally required).</p>
    <h2 id="p6">6. Retention</h2>
    <ul><li>Enrollment records: 7 years (UAE commercial law)</li><li>Payment records: 7 years (UAE Federal Tax Authority)</li><li>Certificate records: Indefinitely (verification)</li><li>Correspondence: 3 years from last contact</li></ul>
    <h2 id="p7">7. Your Rights</h2>
    <p>Under UAE PDPL and DIFC DPL: access, rectification, erasure, restriction, portability, objection, and consent withdrawal. Contact <a href={ACAD}>academy@solvagence.com</a>. We respond within 30 days.</p>
    <h2 id="p8">8. Contact</h2>
    <p><a href={ACAD}>academy@solvagence.com</a> — Subject: Privacy Enquiry</p>
  </LegalShell>
);

export const TermsPage = () => (
  <LegalShell title="Terms & Conditions"
    description="Terms governing enrollment, payment, cancellation, certification, and programme delivery. Governed by DIFC law."
    toc={[{href:'#t1',label:'1. Agreement'},{href:'#t2',label:'2. Enrollment'},{href:'#t3',label:'3. Pricing'},{href:'#t4',label:'4. Cancellation'},{href:'#t5',label:'5. Certification'},{href:'#t6',label:'6. Liability'},{href:'#t7',label:'7. Governing Law'}]}>
    <div className="lp-note">By completing enrollment you agree to these Terms. Governed by <strong>DIFC law</strong> with <strong>DIFC Courts</strong> jurisdiction.</div>
    <h2 id="t1">1. Agreement</h2>
    <p>These Terms form a binding agreement between you and <strong>Solvagence Global AI Academy</strong> (trading name of Solvagence Ltd, DIFC, Dubai, UAE).</p>
    <h2 id="t2">2. Enrollment</h2>
    <p>Enrollment confirmed upon full payment or signed invoice. Places on first-come, first-served basis. You are responsible for providing accurate information.</p>
    <h2 id="t3">3. Pricing and Payment</h2>
    <p>All fees in USD. UAE VAT 5% applies. Payment by card (Stripe) or invoice/LPO. Bundle discount (5%) for 2+ certifications. Team discounts: 10% for 2–5 seats, 20% for 6+ seats.</p>
    <h2 id="t4">4. Cancellation and Refunds</h2>
    <table className="lp-table"><thead><tr><th>Notice</th><th>Outcome</th></tr></thead><tbody>
      <tr><td>14+ days</td><td>Full refund</td></tr>
      <tr><td>7–13 days</td><td>50% refund or free transfer to next cohort</td></tr>
      <tr><td>Under 7 days</td><td>No refund; seat may be transferred</td></tr>
      <tr><td>No-show</td><td>No refund; no transfer</td></tr>
    </tbody></table>
    <p>All cancellations in writing to <a href="mailto:academy@solvagence.com?subject=Cancellation%20Request">academy@solvagence.com</a>. Refunds within 14 working days.</p>
    <h2 id="t5">5. Certification</h2>
    <p>Certificates are professional credentials issued by Solvagence Global AI Academy. Not externally accredited unless stated. Fraudulent representation is grounds for revocation.</p>
    <h2 id="t6">6. Limitation of Liability</h2>
    <p>Total liability shall not exceed fees paid for the relevant programme. No liability for indirect or consequential damages.</p>
    <h2 id="t7">7. Governing Law</h2>
    <p>These Terms are governed by the laws of the <strong>Dubai International Financial Centre (DIFC)</strong>, with exclusive jurisdiction of the <strong>DIFC Courts</strong>.</p>
  </LegalShell>
);

export const AccessibilityPage = () => (
  <LegalShell title="Accessibility Statement"
    description="Our WCAG 2.1 AA conformance statement, implemented measures, and feedback contact.">
    <div className="lp-note">This website substantially conforms to <strong>WCAG 2.1 Level AA</strong>.</div>
    <h2>Standards</h2>
    <ul><li>WCAG 2.1 Level AA</li><li>WAI-ARIA 1.2</li><li>W3C HTML5 (validated)</li></ul>
    <h2>Implemented Measures</h2>
    <ul>
      <li>All images have descriptive alt text or aria-hidden</li>
      <li>Colour contrast ratios meet WCAG 1.4.3 (4.5:1 normal, 3:1 large text)</li>
      <li>Full keyboard navigation throughout</li>
      <li>Skip navigation link at top of each page</li>
      <li>Language and direction declared and updated for EN/AR</li>
      <li>Modals implement focus trapping and ESC key dismissal</li>
      <li>Heading hierarchy is logical (h1 → h2 → h3)</li>
      <li>Minimum 44×44px touch targets for all interactive elements</li>
      <li>Reduced motion respected via prefers-reduced-motion</li>
      <li>High contrast mode supported via forced-colors</li>
    </ul>
    <h2>Feedback</h2>
    <p><a href="mailto:academy@solvagence.com?subject=Accessibility%20Feedback">academy@solvagence.com</a> — Response within 5 working days.</p>
  </LegalShell>
);

export const CookiesPage = () => (
  <LegalShell title="Cookies Policy"
    description="Minimal, transparent cookie usage — UAE PDPL and EU ePrivacy Directive compliant.">
    <div className="lp-note">We use cookies minimally. <strong>No analytics or marketing cookies.</strong></div>
    <h2>Browser Storage</h2>
    <table className="lp-table"><thead><tr><th>Key</th><th>Type</th><th>Purpose</th><th>Expires</th></tr></thead><tbody>
      <tr><td><code>sga-lang</code></td><td>localStorage</td><td>Language preference (EN or AR)</td><td>Until cleared</td></tr>
    </tbody></table>
    <h2>Third-Party Cookies</h2>
    <table className="lp-table"><thead><tr><th>Provider</th><th>Purpose</th><th>When</th></tr></thead><tbody>
      <tr><td>Stripe</td><td>Secure payment processing</td><td>Payment step only</td></tr>
      <tr><td>Google Fonts</td><td>Loading typefaces</td><td>Every page load</td></tr>
    </tbody></table>
    <h2>Contact</h2>
    <p><a href="mailto:academy@solvagence.com?subject=Cookies%20Enquiry">academy@solvagence.com</a></p>
  </LegalShell>
);
