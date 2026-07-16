import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const PARTNERSHIP =
  'mailto:leaders@solvagence.com?subject=Partnership%20Enquiry%20%E2%80%94%20Solvagence%20Global%20AI%20Academy%20%28July%202026%29';

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 32,
  height: 32,
  viewBox: '0 0 256 256',
  fill: '#00d68f',
  'aria-hidden': 'true',
  focusable: 'false',
};

const OPTION_ICONS = [
  <svg {...iconProps}><path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8C53.44,195 88.35,176 128,176s74.56,19,89.07,44a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"/></svg>,
  <svg {...iconProps}><path d="M164.47,155.89A8,8,0,0,1,156,160H36a8,8,0,0,1-6.34-12.81C40.81,132.32,57,122.62,75.77,117.53a52,52,0,1,1,64.46,0C159,122.62,175.19,132.32,186.34,147.19A8,8,0,0,1,164.47,155.89ZM224,48a8,8,0,0,0-8,8V80H200a8,8,0,0,0,0,16h16v24a8,8,0,0,0,16,0V96h16a8,8,0,0,0,0-16H232V56A8,8,0,0,0,224,48Z"/></svg>,
  <svg {...iconProps}><path d="M240,208H224V96a16,16,0,0,0-16-16H144V48a16,16,0,0,0-16-16H48A16,16,0,0,0,32,48V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM208,96V208H144V96ZM48,48h80V208H48ZM96,96H80a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16Zm0,40H80a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16Zm0-80H80a8,8,0,0,0,0,16H96a8,8,0,0,0,0-16Z"/></svg>,
];

const OPTIONS = [
  { title: 'opt.ind.title', desc: 'opt.ind.desc', price: 'opt.ind.price', feats: ['opt.ind.f1', 'opt.ind.f2', 'opt.ind.f3', 'opt.ind.f4'], cta: 'opt.ind.cta', type: 'individual' },
  { title: 'opt.grp.title', desc: 'opt.grp.desc', price: 'opt.grp.price', feats: ['opt.grp.f1', 'opt.grp.f2', 'opt.grp.f3', 'opt.grp.f4'], cta: 'opt.grp.cta', type: 'team', featured: true },
  { title: 'opt.prt.title', desc: 'opt.prt.desc', price: 'opt.prt.price', feats: ['opt.prt.f1', 'opt.prt.f2', 'opt.prt.f3', 'opt.prt.f4', 'opt.prt.f5'], cta: 'opt.prt.cta', href: PARTNERSHIP },
];

const EnrollmentOptions = ({ onEnrollClick }) => {
  const { t } = useTranslation();

  return (
    <section id="enrollment-options" className="section" data-component="EnrollmentOptions" aria-labelledby="opt-heading">
      <span id="contact" className="anchor-target" aria-hidden="true" />
      <div className="section-inner">
        <div className="eyebrow"><span>{t('opt.eyebrow')}</span></div>
        <h2 id="opt-heading" className="section-h rv">{t('opt.h2')}</h2>
        <p className="section-sub rv" style={{ marginBlockStart: '12px' }}>{t('opt.sub')}</p>
        <div className="enroll-grid">
          {OPTIONS.map((option, index) => (
            <article className={`enroll-card rv${option.featured ? ' featured' : ''}`} key={option.title}>
              <span className="ec-ico" aria-hidden="true">{OPTION_ICONS[index]}</span>
              <h3 className="ec-title">{t(option.title)}</h3>
              <p className="ec-desc">{t(option.desc)}</p>
              <div className="ec-price">{t(option.price)}</div>
              <ul className="ec-feats" role="list">
                {option.feats.map(feat => <li className="ec-feat" key={feat}>{t(feat)}</li>)}
              </ul>
              {option.href ? (
                <a className="ec-cta-s" href={option.href}>{t(option.cta)}</a>
              ) : (
                <button className="ec-cta-p" onClick={() => onEnrollClick(option.type)}>{t(option.cta)}</button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

EnrollmentOptions.propTypes = { onEnrollClick: PropTypes.func.isRequired };

export default EnrollmentOptions;
