import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const TrackCard = ({ track, onOpen }) => {
  const { t } = useTranslation();
  const loc   = track.localised || track.en || {};
  const certs = track.certifications || [];

  return (
    <article className="track-card" style={{ '--tc-accent': track.accentColor }}
      aria-label={loc.name} data-component="TrackCard">
      <div className="tc-track-badge">{loc.badge}</div>
      <div className="tc-track-icon" aria-hidden="true">{track.icon}</div>
      <h3 className="tc-name">{loc.name}</h3>
      <p className="tc-desc">{loc.description}</p>

      <div className="tc-certs-list">
        {certs.map(c => {
          const cl = c.localised || c.en || {};
          return (
            <div key={c.code} id={`programmes-${c.code}`} className="tc-cert-row">
              <span className="tc-cert-code">{c.code}</span>
              <span className="tc-cert-name">{cl.title}</span>
              <span className="tc-cert-price">${c.priceUSD?.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      <button className="tc-cta btn-ghost" onClick={onOpen}
        aria-haspopup="dialog" aria-label={`${loc.cta || t('track.explore')} — ${loc.name}`}>
        <span>{loc.cta || 'Explore Track'}</span>
        <span className="tc-cta-arrow" aria-hidden="true">→</span>
      </button>
    </article>
  );
};

TrackCard.propTypes = {
  track:  PropTypes.object.isRequired,
  onOpen: PropTypes.func.isRequired,
};
export default TrackCard;
