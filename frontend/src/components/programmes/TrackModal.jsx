import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const certTitle = cert => cert?.title || cert?.name || cert?.localised?.title || cert?.en?.title || cert?.displayLabel || cert?.code || '';
const certSummary = cert => cert?.summary || cert?.localised?.summary || cert?.en?.summary || '';
const certTagline = cert => cert?.tagline || cert?.localised?.tagline || cert?.en?.tagline || '';
const certOrdinal = cert => {
  const match = cert?.code?.match(/(\d+)/);
  return match ? `${match[1].padStart(2, '0')} / 06` : cert?.code;
};

const TrackModal = ({ track, onClose, onViewCert, onEnroll }) => {
  const { t, isAr } = useTranslation();
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
  const allSelected = certs.length > 0 && selected.length === certs.length;
  const certWord = count => isAr ? (count === 1 ? 'شهادة' : 'شهادات') : (count === 1 ? 'certification' : 'certifications');
  const selectAllLabel = allSelected
    ? (isAr ? 'إلغاء تحديد الكل' : 'Deselect All')
    : (isAr ? 'اختر الكل في المسار' : 'Select All in Track');
  const trackNote = isAr
    ? `${certs.length} ${certWord(certs.length)} في هذا المسار - اختر واحدة أو أكثر للتسجيل`
    : `${certs.length} ${certWord(certs.length)} in this track - select one or more to enroll`;

  const toggleAll = () => {
    setSelected(allSelected ? [] : certs.map(cert => cert.code));
  };

  return createPortal(
    <div id="trackOv" className="track-overlay open" onClick={onClose} role="presentation">
      <div id="trackModal" className="track-modal" role="dialog" aria-modal="true"
        aria-label={loc.name} data-component="TrackModal" onClick={e => e.stopPropagation()}>
        <div className="tm-bar" style={{ background: track.accentColor }} aria-hidden="true"/>
        <div className="tm-head">
          <div className="tm-title-block">
            <div className="tm-icon" aria-hidden="true">{track.icon}</div>
            <div className="tm-copy">
              <div className="tm-eyebrow">{loc.badge}</div>
              <h2 className="tm-title">{loc.name}</h2>
              <p className="tm-desc">{loc.description}</p>
            </div>
          </div>
          <button ref={closeRef} className="tm-close" onClick={onClose} aria-label={t('track.close') || 'Close'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="tm-body">
          <div className="tm-select-note">
            {trackNote}
          </div>
          <div className="tm-certs-grid" id="tmCertsGrid">
            {certs.map(cert => {
              const sel = selected.includes(cert.code);
              const summary = certSummary(cert);
              return (
                <div key={cert.code} className={`tm-cert-card${sel ? ' selected' : ''}`}
                  role="checkbox" aria-checked={sel} tabIndex={0}
                  onClick={() => toggle(cert.code)}
                  onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && toggle(cert.code)}>
                  <div className="tc-cert-check" aria-hidden="true">{sel ? '✓' : ''}</div>
                  <div className="tc-cert-num">{certOrdinal(cert)}</div>
                  <h4 className="tc-cert-name">{certTitle(cert)}</h4>
                  <div className="tc-cert-tag">{certTagline(cert)}</div>
                  <p className="tc-cert-desc">{summary.length > 130 ? `${summary.slice(0, 130)}...` : summary}</p>
                  <div className="tc-cert-price">
                    {isAr ? `من $${cert.priceUSD?.toLocaleString()} / مقعد` : `From $${cert.priceUSD?.toLocaleString()} / seat`}
                  </div>
                  <div className="tc-cert-actions">
                    <button className="tc-cert-detail-btn" onClick={e => { e.stopPropagation(); onViewCert(cert); }}>
                      {t('track.modal.view') || 'View Full Curriculum'}
                    </button>
                    <button className="tc-cert-enroll-btn btn-em" onClick={e => { e.stopPropagation(); onEnroll([cert.code], 'individual'); }}>
                      {t('track.modal.enroll.ind') || 'Enroll Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tm-foot">
          <div className="tm-selection-info">
            <div className="tm-sel-count">
              {selected.length > 0
                ? (isAr ? `تم اختيار ${selected.length} ${certWord(selected.length)}` : `${selected.length} ${certWord(selected.length)} selected`)
                : t('track.modal.none') || 'No certifications selected'}
            </div>
            {total > 0 && <span className="tm-sel-total">${total.toLocaleString()} USD{disc > 0 ? (isAr ? ' (خصم حزمة 5%)' : ' (5% bundle)') : ''}</span>}
          </div>
          <div className="tm-foot-actions">
            <button className="tm-selall-btn" onClick={toggleAll}>
              {selectAllLabel}
            </button>
            <button className="btn-em tm-enroll-track-btn"
              disabled={selected.length === 0}
              onClick={() => onEnroll(selected, 'individual')}>
              {(t('track.modal.enroll') || 'Enroll Selected') + (selected.length > 0 ? ` (${selected.length})` : '')}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

TrackModal.propTypes = {
  track:      PropTypes.object.isRequired,
  onClose:    PropTypes.func.isRequired,
  onViewCert: PropTypes.func.isRequired,
  onEnroll:   PropTypes.func.isRequired,
};
export default TrackModal;
