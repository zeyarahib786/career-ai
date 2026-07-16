import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const TrackCard = ({ track, onOpen }) => {
  const { t, isAr } = useTranslation();
  const loc   = track.localised || track.en || {};
  const certs = track.certifications || [];
  const minPrice = Math.min(...certs.map(c => c.priceUSD || 0).filter(Boolean));
  const trackNo = (track.trackId || '').replace(/\D/g, '') || '1';
  const ref = {
    badge: t(`track.t${trackNo}.badge`) || loc.badge,
    name: t(`track.t${trackNo}.name`) || loc.name,
    desc: t(`track.t${trackNo}.desc`) || loc.description,
    cta: t(`track.t${trackNo}.cta`) || loc.cta || 'Explore Track',
  };

  return (
    <button className={`track-card t${trackNo}`} style={{ '--tc-accent': track.accentColor }}
      onClick={onOpen} aria-haspopup="dialog" role="listitem"
      aria-label={`${ref.cta} — ${ref.name}`} data-component="TrackCard">
      {certs.map(c => <span key={c.code} id={`programmes-${c.code}`} className="sr-only">{c.code}</span>)}
      <div className="tc-icon" aria-hidden="true">{track.icon}</div>
      <div className="tc-label">{ref.badge}</div>
      <h3 className="tc-name">{ref.name}</h3>
      <p className="tc-desc">{ref.desc}</p>

      <div className="tc-certs" aria-hidden="true">
        <div className="tc-cert-count">{certs.length}</div>
        <div className="tc-cert-label">
          {isAr ? (certs.length === 1 ? 'شهادة' : 'شهادات') : (certs.length === 1 ? 'Certification' : 'Certifications')}
        </div>
      </div>

      <div className="tc-price">
        <span>{t('prog.from')}</span> <strong>${minPrice.toLocaleString()}</strong>
      </div>
      <span className="tc-cta" aria-hidden="true">
        <span>{ref.cta}</span>
        <span className="tc-cta-arrow" aria-hidden="true">→</span>
      </span>
    </button>
  );
};

TrackCard.propTypes = {
  track:  PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};
export default TrackCard;
