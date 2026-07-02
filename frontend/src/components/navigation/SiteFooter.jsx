import ComplianceBadges from './ComplianceBadges';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const ACADEMY = 'mailto:academy@solvagence.com?subject=General%20Enquiry%20%E2%80%94%20Solvagence%20Global%20AI%20Academy&body=Dear%20Solvagence%20Academy%20Team%2C%0A%0AName%3A%20%0AOrganisation%3A%20%0AEnquiry%3A%20%0A%0AKind%20regards';
const GUIDE   = 'mailto:academy@solvagence.com?subject=Enrollment%20Guide%20Request%20%E2%80%94%20Solvagence%20Global%20AI%20Academy&body=Dear%20Solvagence%20Academy%20Team%2C%0A%0APlease%20send%20me%20the%20enrollment%20guide.%0A%0AName%3A%20%0AOrganisation%3A%20%0AKind%20regards';
const LEADERS = 'mailto:leaders@solvagence.com?subject=Partnership%20Enquiry%20%E2%80%94%20Solvagence%20Global%20AI%20Academy&body=Dear%20Solvagence%20Leadership%20Team%2C%0A%0AOrganisation%3A%20%0APartnership%20type%3A%20%0AParticipants%3A%20%0A%0AKind%20regards';

const SiteFooter = ({ logoSrc }) => {
  const { t } = useTranslation();

  const PROG_NAMES = ['prog.name1','prog.name2','prog.name3','prog.name4','prog.name5','prog.name6']
    .map((k,i) => ({ key:k, code:`SGA-0${i+1}` }));

  return (
    <footer className="site-footer" role="contentinfo" data-component="SiteFooter">

      {/* ── Compliance strip ── */}
      <section className="section comp-section" aria-labelledby="comp-heading">
        <div className="section-inner">
          <div className="eyebrow"><span data-t="comp.heading">{t('comp.heading') || 'Standards & Compliance'}</span></div>
          <h2 className="section-h" id="comp-heading" style={{ fontSize:'clamp(20px,2.8vw,36px)', marginBlockEnd:'8px' }}>
            Regulatory & Digital Standards
          </h2>
          <p className="section-sub" style={{ marginBlockEnd:'36px' }}>
            {t('foot.comp.note') || 'Solvagence Global AI Academy maintains ongoing commitment to regulatory, digital, and professional standards across the DIFC, UAE, GCC, and internationally.'}
            {' '}<a href={ACADEMY} className="comp-link">academy@solvagence.com</a>
          </p>
          <ComplianceBadges/>
        </div>
      </section>

      {/* ── Footer nav grid ── */}
      <div className="footer-nav-wrap">
        <div className="section-inner footer-grid">

          <div className="footer-brand">
            <div className="footer-logo-row">
              <img src={logoSrc} alt="Solvagence" className="footer-logo-img" width="34" height="31"/>
              <span className="footer-brand-name">Solvagence</span>
            </div>
            <p className="footer-tagline" data-t="foot.tagline">
              {t('foot.tagline') || 'Solvagence Global AI Academy — Building the AI-capable professionals who will lead the next decade.'}
            </p>
            <div className="footer-social" aria-label="Social media">
              <a href="https://linkedin.com/company/solvagence" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
              <a href="https://x.com/solvagence" aria-label="X / Twitter" target="_blank" rel="noopener noreferrer">𝕏</a>
            </div>
          </div>

          <nav aria-label="Programmes">
            <h3 className="footer-nav-head"><span data-t="foot.h.prog">{t('foot.h.prog')}</span></h3>
            <ul>
              {PROG_NAMES.map(p => (
                <li key={p.code}><Link to={`/#programmes-${p.code}`}><span data-t={p.key}>{t(p.key)}</span></Link></li>
              ))}
              <li className="footer-ext-item">
                <a href="https://ainative.solvagence.com" target="_blank" rel="noopener noreferrer" className="footer-ext-link">
                  <span data-t="foot.l.ainative">{t('foot.l.ainative') || 'AI Native — K12 to PhD'}</span> ↗
                </a>
              </li>
              <li className="footer-ext-item">
                <a href="https://aiexecutives.solvagence.com" target="_blank" rel="noopener noreferrer" className="footer-ext-link">
                  <span data-t="foot.l.aiexec">{t('foot.l.aiexec') || 'AI Leadership & CXO'}</span> ↗
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Academy">
            <h3 className="footer-nav-head"><span data-t="foot.h.acad">{t('foot.h.acad')}</span></h3>
            <ul>
              <li><Link to="/#why-us"><span data-t="foot.l.why">{t('foot.l.why')}</span></Link></li>
              <li><Link to="/#pathway"><span data-t="foot.l.path">{t('foot.l.path')}</span></Link></li>
              <li><Link to="/#contact"><span data-t="foot.l.grp">{t('foot.l.grp')}</span></Link></li>
              <li><a href={LEADERS}><span data-t="foot.l.prt">{t('foot.l.prt')}</span></a></li>
              <li><Link to="/#faq"><span data-t="foot.l.faq">{t('foot.l.faq')}</span></Link></li>
              <li><a href={ACADEMY}><span data-t="foot.l.contact">{t('foot.l.contact')}</span></a></li>
            </ul>
          </nav>

          <nav aria-label="Support">
            <h3 className="footer-nav-head"><span data-t="foot.h.supp">{t('foot.h.supp')}</span></h3>
            <ul>
              <li><a href={GUIDE}><span data-t="foot.l.guide">{t('foot.l.guide')}</span></a></li>
              <li><Link to="/terms#t4"><span data-t="foot.l.refund">{t('foot.l.refund')}</span></Link></li>
              <li><Link to="/privacy"><span data-t="foot.l.privacy">{t('foot.l.privacy') || 'Privacy Policy'}</span></Link></li>
              <li><Link to="/terms"><span data-t="foot.l.terms">{t('foot.l.terms') || 'Terms & Conditions'}</span></Link></li>
              <li><a href={`mailto:academy@solvagence.com`}>academy@solvagence.com</a></li>
              <li><a href={LEADERS}>leaders@solvagence.com</a></li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom-bar">
        <div className="section-inner footer-bottom-inner">
          <p className="footer-copy" data-t="foot.copy">{t('foot.copy')}</p>
          <nav className="footer-legal-nav" aria-label="Legal links">
            {[['privacy',t('foot.legal.privacy')||'Privacy'], ['terms',t('foot.legal.terms')||'Terms'],
              ['accessibility',t('foot.legal.a11y')||'Accessibility'], ['cookies',t('foot.legal.cookies')||'Cookies']
            ].map(([path,label]) => (
              <Link key={path} to={`/${path}`}><span data-t={`foot.legal.${path==='accessibility'?'a11y':path}`}>{label}</span></Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Legal disclaimer ── */}
      <div className="footer-legal-block">
        <div className="section-inner">
          <p className="footer-legal-text">
            <strong data-t="foot.legal.notice.label">{t('foot.legal.notice.label') || 'Legal Notice:'}</strong>{' '}
            <span data-t="foot.legal.notice.text">
              {t('foot.legal.notice.text') || 'Solvagence Global AI Academy is a trading name of Solvagence Ltd, registered in the UAE. All institutional affiliations refer to alumni connections — not institutional endorsements. All prices subject to 5% UAE VAT.'}
            </span>{' '}
            <a href={ACADEMY} className="footer-legal-link">academy@solvagence.com</a>
          </p>
          <p className="footer-legal-text">
            <strong data-t="foot.legal.dp.label">{t('foot.legal.dp.label') || 'Data Protection:'}</strong>{' '}
            <span data-t="foot.legal.dp.text">
              {t('foot.legal.dp.text') || 'Personal data is processed per our Privacy Policy, UAE PDPL (Federal Law No. 45/2021), and DIFC DPL 2020, where applicable.'}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

SiteFooter.propTypes = { logoSrc: PropTypes.string.isRequired };
export default SiteFooter;
