import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const TrackModal = ({ track, onClose, onViewCert, onEnroll }) => {
  const { t } = useTranslation();
  const closeRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const loc   = track?.localised || track?.en || {};
  const certs = track?.certifications || [];

  useEffect(() => {
    const prev = document.activeElement;
    setTimeout(() => closeRef.current?.focus(), 350);
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus?.(); };
  }, [onClose]);

  const toggle = code => setSelected(s =>
    s.includes(code) ? s.filter(c => c !== code) : [...s, code]
  );

  const base  = selected.reduce((sum, code) => {
    const c = certs.find(c => c.code === code);
    return sum + (c?.priceUSD || 0);
  }, 0);
  const disc  = selected.length >= 2 ? Math.round(base * 0.05) : 0;
  const total = base - disc;

  return (
    <>
      <div id="trackOv" className="track-ov open" onClick={onClose} aria-hidden="true"/>
      <div id="trackModal" className="track-modal" role="dialog" aria-modal="true"
        aria-label={loc.name} data-component="TrackModal">
        <div className="tm-bar" style={{ background: track.accentColor }} aria-hidden="true"/>
        <div className="tm-header">
          <div className="tm-icon" aria-hidden="true">{track.icon}</div>
          <div className="tm-copy">
            <div className="tm-eyebrow">{loc.badge}</div>
            <h2 className="tm-title">{loc.name}</h2>
            <p className="tm-desc">{loc.description}</p>
          </div>
          <button ref={closeRef} className="tm-close" onClick={onClose} aria-label={t('track.close') || 'Close'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="tm-certs-grid" id="tmCertsGrid">
          {certs.map(cert => {
            const cl  = cert.localised || cert.en || {};
            const sel = selected.includes(cert.code);
            return (
              <div key={cert.code} className={`tm-cert-card${sel ? ' selected' : ''}`}
                role="checkbox" aria-checked={sel} tabIndex={0}
                onClick={() => toggle(cert.code)}
                onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggle(cert.code)}>
                <div className="tc-cert-check" aria-hidden="true">{sel ? '✓' : ''}</div>
                <div className="tc-cert-num">{cert.code}</div>
                <h4 className="tc-cert-name">{cl.title}</h4>
                <div className="tc-cert-tag">{cl.tagline}</div>
                <p className="tc-cert-desc">{cl.summary?.slice(0,110)}…</p>
                <div className="tc-cert-price">${cert.priceUSD?.toLocaleString()}</div>
                <div className="tc-cert-actions">
                  <button className="tc-cert-detail-btn" onClick={e => { e.stopPropagation(); onViewCert(cert); }}>
                    {t('track.modal.view') || 'View Curriculum'}
                  </button>
                  <button className="tc-cert-enroll-btn btn-em" onClick={e => { e.stopPropagation(); onEnroll([cert.code],'individual'); }}>
                    {t('track.modal.enroll.ind') || 'Enroll Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tm-foot">
          <div className="tm-sel-info">
            <span>{selected.length > 0 ? `${selected.length} selected` : t('track.modal.none') || 'None selected'}</span>
            {total > 0 && <span className="tm-sel-total">${total.toLocaleString()} USD{disc > 0 ? ' (5% bundle)' : ''}</span>}
          </div>
          <button className="btn-em tm-enroll-track-btn"
            disabled={selected.length === 0}
            onClick={() => onEnroll(selected, 'individual')}>
            {t('track.modal.enroll') || `Enroll Selected (${selected.length})`}
          </button>
        </div>
      </div>
    </>
  );
};

TrackModal.propTypes = {
  track:      PropTypes.object.isRequired,
  onClose:    PropTypes.func.isRequired,
  onViewCert: PropTypes.func.isRequired,
  onEnroll:   PropTypes.func.isRequired,
};
export default TrackModal;
