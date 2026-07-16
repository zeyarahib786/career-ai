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

const WHY_ICONS = [
  <svg {...iconProps}><path d="M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L56,160a8,8,0,0,1-5.08-13.87l.14-.13,112-120a8,8,0,0,1,13.69,7L162.09,106.63,208,112a8,8,0,0,1,5.83,13.45Z"/></svg>,
  <svg {...iconProps}><path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34l13.49-58.61-45.1-39.35a16,16,0,0,1,9.12-28.2l59.32-5.58,23.16-55.49a15.95,15.95,0,0,1,29.44,0h0L166,80.61l59.32,5.57a16,16,0,0,1,9.12,28.2Z"/></svg>,
  <svg {...iconProps}><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"/></svg>,
  <svg {...iconProps}><path d="M248,124a56.11,56.11,0,0,0-32-50.61V72a48,48,0,0,0-88-26.49A48,48,0,0,0,40,72v1.39A56,56,0,0,0,40,180.61V184a48,48,0,0,0,88,26.49A48,48,0,0,0,216,184v-3.39A56.11,56.11,0,0,0,248,124Z"/></svg>,
  <svg {...iconProps}><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm88,104a87.61,87.61,0,0,1-3.33,24H174.16a147.33,147.33,0,0,0,1.84-24,147.33,147.33,0,0,0-1.84-24h38.51A87.61,87.61,0,0,1,216,128ZM40,128a87.61,87.61,0,0,1,3.33-24H81.84A147.33,147.33,0,0,0,80,128a147.33,147.33,0,0,0,1.84,24H43.33A87.61,87.61,0,0,1,40,128Z"/></svg>,
  <svg {...iconProps}><path d="M208,40H48A16,16,0,0,0,32,56V120c0,88.61,91.11,114.45,93,115a8,8,0,0,0,6,0c1.89-.55,93-26.39,93-115V56A16,16,0,0,0,208,40Z"/></svg>,
];

const ITEMS = [
  ['why.t1', 'why.d1'],
  ['why.t2', 'why.d2'],
  ['why.t3', 'why.d3'],
  ['why.t4', 'why.d4'],
  ['why.t5', 'why.d5'],
  ['why.t6', 'why.d6'],
];

const WhySection = () => {
  const { t } = useTranslation();
  return (
    <section id="why-us" className="section section-alt" data-component="WhySection"
      aria-labelledby="why-heading">
      <div className="section-inner">
        <div className="section-top">
          <div>
            <div className="eyebrow"><span data-t="why.eyebrow">{t('why.eyebrow')}</span></div>
            <h2 className="section-h rv" id="why-heading" data-t="why.h2">{t('why.h2')}</h2>
          </div>
          <p className="section-sub rv" data-t="why.sub">{t('why.sub')}</p>
        </div>
        <div className="why-grid" role="list">
          {ITEMS.map(([title, desc], index) => (
            <div key={title} className="why-card rv" role="listitem">
              <span className="why-ico" aria-hidden="true">{WHY_ICONS[index]}</span>
              <h3 className="why-title">{t(title)}</h3>
              <p className="why-desc">{t(desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
