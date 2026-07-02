import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const HeroSection = ({ onEnrollClick }) => {
  const { t } = useTranslation();

  return (
    <section className="hero" aria-labelledby="hero-heading" data-component="HeroSection">
      {/* Background effects */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hb-grid"/><div className="hb-glow1"/><div className="hb-glow2"/>
      </div>

      <div className="section-inner hero-inner">
        <div className="hero-eyebrow-row">
          <span className="eyebrow"><span data-t="hero.open">{t('hero.open')}</span></span>
          <span className="hero-badge"><span data-t="hero.badge">{t('hero.badge')}</span></span>
        </div>

        <h1 className="hero-h1 rv" id="hero-heading"
          aria-label={`${t('hero.h1a')} ${t('hero.h1b')} ${t('hero.h1c')}`}>
          <span className="l1" data-t="hero.h1a">{t('hero.h1a')}</span>
          <span className="l2" data-t="hero.h1b">{t('hero.h1b')}</span>
          <span className="l3" data-t="hero.h1c">{t('hero.h1c')}</span>
        </h1>

        <p className="hero-sub rv" data-t="hero.sub">{t('hero.sub')}</p>

        <div className="hero-stats rv" aria-label="Key facts">
          {[
            { n:t('hero.s1n'), l:t('hero.s1l') },
            { n:t('hero.s2n'), l:t('hero.s2l') },
            { n:t('hero.s3n'), l:t('hero.s3l') },
          ].map((s,i) => (
            <div key={i} className="hero-stat">
              <span className="hero-stat-n">{s.n}</span>
              <span className="hero-stat-l">{s.l}</span>
            </div>
          ))}
        </div>

        <div className="hero-actions rv">
          <button className="btn-em hero-cta" onClick={onEnrollClick}
            aria-label={t('hero.cta.enroll')}>
            <span data-t="hero.cta.enroll">{t('hero.cta.enroll')}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <a href="/#programmes" className="btn-ghost" aria-label={t('hero.cta.view')}>
            <span data-t="hero.cta.view">{t('hero.cta.view')}</span>
          </a>
        </div>

        <div className="hero-ssl rv" aria-label="Security indicators">
          <div className="ssl-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span data-t="sec.ssl">{t('sec.ssl')}</span>
          </div>
          <div className="ssl-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 8h6v2H9V8z"/>
            </svg>
            <span data-t="sec.gw">{t('sec.gw')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = { onEnrollClick: PropTypes.func.isRequired };
export default HeroSection;
