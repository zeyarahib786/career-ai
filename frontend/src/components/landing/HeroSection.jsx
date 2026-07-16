import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const HeroSection = ({ onEnrollClick }) => {
  const { t } = useTranslation();

  return (
    <section className="hero" aria-labelledby="hero-heading" data-component="HeroSection">
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-badge-row">
          <div className="hero-badge" role="status">
            <div className="hero-dot" aria-hidden="true" />
            <span className="hero-badge-txt" data-t="hero.badge">{t('hero.badge')}</span>
          </div>
          <span className="hero-sep" aria-hidden="true">·</span>
          <span className="hero-open" data-t="hero.open">{t('hero.open')}</span>
        </div>

        <h1 className="hero-h1" id="hero-heading"
          aria-label={`${t('hero.h1a')} ${t('hero.h1b')} ${t('hero.h1c')}`}>
          <span className="l1" data-t="hero.h1a">{t('hero.h1a')}</span>
          <span className="l2" data-t="hero.h1b">{t('hero.h1b')}</span>
          <span className="l3" data-t="hero.h1c">{t('hero.h1c')}</span>
        </h1>

        <p className="hero-sub" data-t="hero.sub">{t('hero.sub')}</p>

        <div className="hero-ctas">
          <button className="btn btn-em" style={{ fontSize: '1rem', padding: '14px 32px' }} onClick={onEnrollClick}
            aria-label={t('hero.cta.enroll')}>
            <span data-t="hero.cta.enroll">{t('hero.cta.enroll')}</span>
          </button>
          <a href="/#programmes" className="btn btn-ghost" style={{ fontSize: '1rem', padding: '14px 28px' }} aria-label={t('hero.cta.view')}>
            <span data-t="hero.cta.view">{t('hero.cta.view')}</span>
          </a>
        </div>

        <div className="hero-stats" role="list" aria-label="Academy highlights">
          {[
            { n:t('hero.s1n'), l:t('hero.s1l') },
            { n:t('hero.s2n'), l:t('hero.s2l') },
            { n:t('hero.s3n'), l:t('hero.s3l') },
          ].map((s,i) => (
            <div key={i} className="h-stat" role="listitem">
              <div className="hs-n">{s.n}</div>
              <div className="hs-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = { onEnrollClick: PropTypes.func.isRequired };
export default HeroSection;
