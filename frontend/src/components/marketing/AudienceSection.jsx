import { useTranslation } from '../../hooks/useTranslation';

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 26,
  height: 26,
  viewBox: '0 0 256 256',
  fill: '#00d68f',
  'aria-hidden': 'true',
  focusable: 'false',
};

const AUDIENCE_ICONS = [
  <svg {...iconProps}><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V117.87l19.76-10.81a8,8,0,0,0,0-14.12ZM192,200H64V126.43l56,30.57,72-39.35V200Z"/></svg>,
  <svg {...iconProps}><path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.71-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"/></svg>,
  <svg {...iconProps}><path d="M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V94.37l50.52-38.06a8,8,0,0,1,9.37-.49l55.23,36.82,50.51-38a8,8,0,1,1,9.7,12.69l-56,42.15a8,8,0,0,1-9.38.49L104.44,154l-56.44-42.33V200H224A8,8,0,0,1,232,208Z"/></svg>,
  <svg {...iconProps}><path d="M220.22,158.42l-24-64A8,8,0,0,0,188.87,89l-32,8.67L144.19,72H160a8,8,0,0,0,0-16H144V40a8,8,0,0,0-16,0V56H112a8,8,0,0,0,0,16h15.81L115.13,97.67,83.13,89A8,8,0,0,0,74.78,94.42l-24,64A8,8,0,0,0,56,168a80,80,0,0,0,144,0A8,8,0,0,0,220.22,158.42Z"/></svg>,
];

const AUDIENCES = [
  ['aud.n1', 'aud.d1'],
  ['aud.n2', 'aud.d2'],
  ['aud.n3', 'aud.d3'],
  ['aud.n4', 'aud.d4'],
];

const AudienceSection = () => {
  const { t } = useTranslation();

  return (
    <section id="audience" className="section" data-component="AudienceSection" aria-labelledby="aud-heading">
      <div className="section-inner">
        <div className="section-top">
          <div>
            <div className="eyebrow"><span>{t('aud.eyebrow')}</span></div>
            <h2 id="aud-heading" className="section-h rv">{t('aud.h2')}</h2>
          </div>
          <p className="section-sub rv">{t('aud.sub')}</p>
        </div>
        <div className="aud-grid" role="list">
          {AUDIENCES.map(([title, desc], index) => (
            <article className="aud-card rv" role="listitem" key={title}>
              <span className="aud-ico" aria-hidden="true">{AUDIENCE_ICONS[index]}</span>
              <h3 className="aud-name">{t(title)}</h3>
              <p className="aud-desc">{t(desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
