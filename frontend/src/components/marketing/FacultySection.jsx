import { useTranslation } from '../../hooks/useTranslation';

const FACULTY_INTEREST =
  'mailto:academy@solvagence.com?subject=Faculty%20Expression%20of%20Interest%20%E2%80%94%20Solvagence%20Global%20AI%20Academy%20%28July%202026%20Cohort%29&body=Dear%20Solvagence%20Academy%20Team%2C%0A%0AI%20am%20a%20senior%20AI%20practitioner%20and%20I%20would%20like%20to%20express%20my%20interest%20in%20teaching%20with%20the%20Solvagence%20Global%20AI%20Academy.%0A%0ABackground%3A%0AName%3A%20%0ASpecialism%20/%20Track%20of%20Interest%3A%20%0AYears%20of%20Enterprise%20Experience%3A%20%0AUniversity%20Alumni%20Affiliation%20%28if%20applicable%29%3A%20%0ALinkedIn%20or%20CV%20link%3A%20%0A%0AI%20look%20forward%20to%20discussing%20further.%0A%0AKind%20regards';

const ICONS = [
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="#00d68f"><path d="M240,208H224V96a16,16,0,0,0-16-16H144V48a16,16,0,0,0-16-16H48A16,16,0,0,0,32,48V208H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM48,48h80V208H48ZM208,96V208H144V96Z"/></svg>,
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="#00d68f"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V117.87l19.76-10.81a8,8,0,0,0,0-14.12ZM192,200H64V126.43l56,30.57,72-39.35V200Z"/></svg>,
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" fill="#00d68f"><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34l13.49-58.61-45.1-39.35a16,16,0,0,1,9.12-28.2l59.32-5.58,23.16-55.49a15.95,15.95,0,0,1,29.44,0h0L166,80.61l59.32,5.57a16,16,0,0,1,9.12,28.2Z"/></svg>,
];

const CRITERIA = [
  ['fac.crit1.title', 'fac.crit1.desc', ICONS[0]],
  ['fac.crit2.title', 'fac.crit2.desc', ICONS[1]],
  ['fac.crit3.title', 'fac.crit3.desc', ICONS[2]],
];

const UNIVERSITIES = [
  'Harvard Business School',
  'University of Oxford',
  'IIM Alumni',
  'IIM Alumni',
  'ISB Alumni',
  'London Business School',
  'INSEAD',
  'MIT Sloan',
  'National University of Singapore',
];

const FacultySection = () => {
  const { t } = useTranslation();

  return (
    <section id="faculty" className="section" data-component="FacultySection" aria-labelledby="faculty-heading">
      <div className="section-inner">
        <div className="section-top">
          <div>
            <div className="eyebrow"><span>{t('fac.eyebrow')}</span></div>
            <h2 className="section-h rv" id="faculty-heading">{t('fac.h2')}</h2>
          </div>
          <p className="section-sub rv">{t('fac.sub')}</p>
        </div>

        <div className="fac-uni-strip rv" role="region" aria-labelledby="fac-uni-label">
          <div className="fac-uni-label" id="fac-uni-label">
            <span>{t('fac.uni.label')}</span>
          </div>
          <div className="fac-unis">
            {UNIVERSITIES.map((name, index) => (
              <span className="fac-uni" key={`${name}-${index}`}>{name}</span>
            ))}
          </div>
          <p className="fac-note-sub">{t('fac.uni.note')}</p>
        </div>

        <div className="fac-notice-box rv">
          <div className="fac-notice-inner">
            <div className="fac-notice-ico" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 256" fill="currentColor">
                <path d="M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"/>
              </svg>
            </div>
            <div>
              <h3 className="fac-notice-title">{t('fac.notice.title')}</h3>
              <p className="fac-notice-text">
                <span>{t('fac.notice.text')}</span>{' '}
                <a href={FACULTY_INTEREST} className="fac-notice-link">
                  <span>{t('fac.notice.link')}</span>
                </a>
                <span>{t('fac.notice.text2')}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="fac-criteria-grid rv" role="list" aria-label="Faculty selection criteria">
          {CRITERIA.map(([title, desc, icon]) => (
            <article className="fac-crit-card" role="listitem" key={title}>
              <span className="fac-crit-ico" aria-hidden="true">{icon}</span>
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
