import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const certTitle = cert => cert?.name || cert?.title || cert?.localised?.title || cert?.en?.title || cert?.code || '';
const certSummary = cert => cert?.summary || cert?.localised?.summary || cert?.en?.summary || '';
const certTagline = cert => cert?.tagline || cert?.localised?.tagline || cert?.en?.tagline || '';
const certModules = cert => cert?.curriculum || cert?.modules || cert?.localised?.curriculum || cert?.localised?.modules || cert?.en?.curriculum || cert?.en?.modules || [];
const certWhy = cert => cert?.whyChoose || cert?.localised?.whyChoose || cert?.en?.whyChoose || '';
const certGain = cert => cert?.whatGain || cert?.localised?.whatGain || cert?.en?.whatGain || '';
const certChips = cert => cert?.outcomes || cert?.chips || cert?.localised?.outcomes || cert?.localised?.chips || cert?.en?.outcomes || cert?.en?.chips || [];

const CurriculumDrawer = ({ cert, onClose, onEnroll }) => {
  const { t, isAr } = useTranslation();
  const closeRef = useRef(null);

  useEffect(() => {
    const prev = document.activeElement;
    setTimeout(() => closeRef.current?.focus(), 350);
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose]);

  if (!cert) return null;

  const modules = certModules(cert);
  const chips = certChips(cert);
  const title = certTitle(cert);
  const summary = certSummary(cert);
  const tagline = certTagline(cert);
  const why = certWhy(cert);
  const gain = certGain(cert);

  return createPortal(
    <>
      <div id="drawerOv" className="drawer-overlay open" onClick={onClose} aria-hidden="true"/>
      <aside id="drawerPanel" className="drawer-panel open" role="dialog" aria-modal="true"
        aria-label={title} data-component="CurriculumDrawer">
        <div className="drawer-bar" aria-hidden="true"/>
        <div className="drawer-head">
          <div className="drawer-brand">
            <img src="/solvagence-logo-transparent.png" alt="" aria-hidden="true"/>
            <div>
              <div className="drawer-brand-name">Solvagence Global AI Academy</div>
              <div className="drawer-eyebrow">{`${t('dr.cert') || 'Certification'} ${cert.code}`}</div>
            </div>
          </div>
          <button ref={closeRef} className="drawer-close" onClick={onClose}
            aria-label={t('dr.close') || 'Close'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="drawer-panel-scroll">
          <div className="drawer-body">
            <div className="drawer-title-block">
              <div className="drawer-icon-row">
                <div className="drawer-icon" aria-hidden="true">{cert.icon}</div>
                <div className="drawer-tag">{tagline}</div>
              </div>
              <h2 className="drawer-title">{title}</h2>
              <p className="drawer-summary">{summary}</p>
              <div className="drawer-price">
                {isAr ? 'الاستثمار' : 'Investment'} <strong>${cert.priceUSD?.toLocaleString()}</strong>
              </div>
              {chips.length > 0 && (
                <div className="drawer-chips" aria-label="Programme highlights">
                  {chips.map((chip, i) => <div key={i} className="drawer-chip">{chip}</div>)}
                </div>
              )}
            </div>

            <div className="drawer-sec">
              <div className="drawer-sec-hd"><span>{t('dr.curriculum') || 'Programme Curriculum'}</span></div>
              <div className="drawer-mods" role="list">
                {modules.map((module, i) => (
                  <div key={module.code || i} className="drawer-mod" role="listitem">
                    <span className="drawer-mod-n">{module.code || `M${i + 1}`}</span>
                    <span className="drawer-mod-t">{module.title || module}</span>
                  </div>
                ))}
              </div>
            </div>

            {why && (
              <div className="drawer-sec">
                <div className="drawer-sec-hd"><span>{t('dr.why') || 'Why Professionals Choose This'}</span></div>
                <div className="drawer-hl"><p>{why}</p></div>
              </div>
            )}

            {gain && (
              <div className="drawer-sec">
                <div className="drawer-sec-hd"><span>{t('dr.gain') || 'What You Will Gain'}</span></div>
                <div className="drawer-hl"><p>{gain}</p></div>
              </div>
            )}

            <div className="drawer-cta">
              <button className="btn btn-em" onClick={() => onEnroll([cert.code], 'individual')}
                data-t="dr.enroll.ind">{t('dr.enroll.ind') || 'Enroll - Individual'}</button>
              <button className="btn btn-ghost" onClick={() => onEnroll([cert.code], 'team')}
                data-t="dr.enroll.grp">{t('dr.enroll.grp') || 'Enroll - Group / Team'}</button>
              <button className="btn btn-mono" onClick={onClose}>{t('dr.close') || 'Close'}</button>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

CurriculumDrawer.propTypes = {
  cert:    PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onEnroll:PropTypes.func.isRequired,
};
export default CurriculumDrawer;
