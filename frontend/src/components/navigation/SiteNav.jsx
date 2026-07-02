import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const SiteNav = ({ logoSrc, onEnrollClick }) => {
  const { t, locale, toggleLang, isAr } = useTranslation();
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive:true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { label:t('nav.programs'), href:'/#programmes' },
    { label:t('nav.why'),     href:'/#why-us' },
    { label:t('nav.faculty'), href:'/#faculty' },
    { label:t('nav.faq'),     href:'/#faq' },
  ];

  return (
    <nav id="siteNav" className={`site-nav${scrolled?' scrolled':''}`}
      aria-label="Primary navigation" data-component="SiteNav">
      <a href="#main-content" className="skip-link">
        {isAr ? 'تخطى إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="Solvagence Global AI Academy — Home">
          <img src={logoSrc} alt="Solvagence" className="nav-logo-img" width="34" height="31"/>
          <div className="nav-logo-div" aria-hidden="true"/>
          <div>
            <span className="nav-logo-name">Solvagence</span>
            <span className="nav-logo-sub">Global AI Academy</span>
          </div>
        </Link>

        <ul className="nav-links" role="list">
          {links.map(l => (
            <li key={l.href}><a href={l.href} className="nav-link">{l.label}</a></li>
          ))}
        </ul>

        <div className="nav-right">
          <div className="lang-pill" role="group" aria-label={isAr ? 'اختيار اللغة' : 'Language selection'}>
            {['en','ar'].map(lang => (
              <button key={lang}
                className={`lang-seg${locale===lang?' active':''}`}
                onClick={locale !== lang ? toggleLang : undefined}
                aria-current={locale === lang}
                aria-label={lang === 'en' ? 'English' : 'Arabic — عربي'}
              >{lang.toUpperCase()}</button>
            ))}
          </div>
          <button className="nav-cta" onClick={onEnrollClick} aria-label={t('nav.enroll')}>
            {t('nav.enroll')}
          </button>
          <button id="navHam" className="nav-hamburger"
            onClick={() => setMenuOpen(m => !m)}
            aria-expanded={menuOpen} aria-controls="mobNav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span/><span/><span/>
          </button>
        </div>
      </div>

      <div id="mobNav" className={`mob-nav${menuOpen?' open':''}`} aria-hidden={!menuOpen}>
        {links.map(l => (
          <a key={l.href} href={l.href} className="mob-close-link mob-link"
            onClick={() => setMenuOpen(false)}>{l.label}</a>
        ))}
        <button className="btn-em mob-enroll" onClick={() => { setMenuOpen(false); onEnrollClick(); }}>
          {t('nav.enroll')}
        </button>
      </div>
    </nav>
  );
};

SiteNav.propTypes = {
  logoSrc:      PropTypes.string.isRequired,
  onEnrollClick:PropTypes.func.isRequired,
};

export default SiteNav;
