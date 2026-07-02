import { useEffect, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const CurriculumDrawer = ({ cert, onClose, onEnroll }) => {
  const { t } = useTranslation();
  const closeRef = useRef(null);
  const loc = cert?.localised || cert?.en || {};

  useEffect(() => {
    const prev = document.activeElement;
    setTimeout(() => closeRef.current?.focus(), 350);
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose]);

  if (!cert) return null;

  return (
    <>
      <div id="drawerOv" className="drawer-ov open" onClick={onClose} aria-hidden="true"/>
      <aside id="drawerPanel" className="drawer-panel open" role="dialog" aria-modal="true"
        aria-label={loc.title} data-component="CurriculumDrawer">
        <div className="drawer-panel-scroll">
          <div className="drawer-top">
            <div>
              <div className="dr-ref" aria-label="Certification code">
                {`${t('dr.cert') || 'Certification'} ${cert.code}`}
              </div>
              <div className="drawer-icon" aria-hidden="true">{cert.icon}</div>
              <div className="drawer-tag">{loc.tagline}</div>
              <h2 className="drawer-title">{loc.title}</h2>
            </div>
            <button ref={closeRef} className="drawer-close" onClick={onClose}
              aria-label={t('dr.close') || 'Close'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <p className="drawer-summary">{loc.summary}</p>

          <div className="drawer-section">
            <div className="drawer-sec-h" data-t="dr.curriculum">{t('dr.curriculum')}</div>
            <div className="drawer-mods" role="list">
              {(loc.modules || []).map((m, i) => (
                <div key={i} className="drawer-mod" role="listitem">
                  <span className="drawer-mod-n">{m.code}</span>
                  <span className="drawer-mod-t">{m.title}</span>
                </div>
              ))}
            </div>
          </div>

          {loc.whyChoose && (
            <div className="drawer-section">
              <div className="drawer-sec-h" data-t="dr.why">{t('dr.why')}</div>
              <p className="drawer-body-text">{loc.whyChoose}</p>
            </div>
          )}

          {loc.whatGain && (
            <div className="drawer-section">
              <div className="drawer-sec-h" data-t="dr.gain">{t('dr.gain')}</div>
              <p className="drawer-body-text">{loc.whatGain}</p>
            </div>
          )}

          {(loc.chips || []).length > 0 && (
            <div className="drawer-chips" aria-label="Programme highlights">
              {loc.chips.map((c,i) => <div key={i} className="drawer-chip">{c}</div>)}
            </div>
          )}
        </div>

        <div className="drawer-foot">
          <div className="drawer-price-wrap">
            <div className="drawer-price-lbl" data-t="dr.indiv">{t('dr.indiv') || 'Individual'}</div>
            <div className="drawer-price">${cert.priceUSD?.toLocaleString()} <span>USD</span></div>
          </div>
          <div className="drawer-foot-btns">
            <button className="btn-ghost" onClick={() => onEnroll([cert.code], 'individual')}
              data-t="dr.enroll.ind">{t('dr.enroll.ind')}</button>
            <button className="btn-em" onClick={() => onEnroll([cert.code], 'team')}
              data-t="dr.enroll.grp">{t('dr.enroll.grp')}</button>
          </div>
        </div>
      </aside>
    </>
  );
};

CurriculumDrawer.propTypes = {
  cert:    PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEnroll:PropTypes.func.isRequired,
};
export default CurriculumDrawer;
