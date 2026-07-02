import { useTranslation } from '../../hooks/useTranslation';

const CRITERIA = [
  ['fac.crit1.title', 'fac.crit1.desc', '01'],
  ['fac.crit2.title', 'fac.crit2.desc', '02'],
  ['fac.crit3.title', 'fac.crit3.desc', '03'],
];

const FacultySection = () => {
  const { t } = useTranslation();

  return (
    <section id="faculty" className="section" data-component="FacultySection" aria-labelledby="faculty-heading">
      <div className="section-inner">
        <div className="section-hdr">
          <div className="eyebrow"><span>{t('fac.eyebrow')}</span></div>
          <h2 className="section-h" id="faculty-heading">{t('fac.h2')}</h2>
          <p className="section-sub">{t('fac.sub')}</p>
        </div>

        <div className="fac-notice-box">
          <div className="fac-notice-inner">
            <div className="fac-notice-ico" aria-hidden="true">◆</div>
            <div>
              <h3 className="fac-notice-title">{t('fac.notice.title')}</h3>
              <p className="fac-notice-text">{t('fac.notice.text')}</p>
            </div>
          </div>
        </div>

        <div className="fac-criteria-grid">
          {CRITERIA.map(([title, desc, num]) => (
            <article className="fac-crit-card" key={title}>
              <span className="fac-crit-ico" aria-hidden="true">{num}</span>
              <h3 className="fac-crit-name">{t(title)}</h3>
              <p className="fac-crit-desc">{t(desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacultySection;
