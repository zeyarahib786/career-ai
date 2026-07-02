import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import useCertifications from '../../hooks/useCertifications';
import TrackCard from './TrackCard';
import TrackModal from './TrackModal';
import CurriculumDrawer from './CurriculumDrawer';

const CertificationPortfolio = ({ onEnrollClick }) => {
  const { t } = useTranslation();
  const { tracks, loading, error } = useCertifications();
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeCert,  setActiveCert]  = useState(null);

  const handleOpenTrack  = track  => setActiveTrack(track);
  const handleOpenDrawer = cert   => { setActiveTrack(null); setActiveCert(cert); };
  const handleEnroll     = (codes) => { setActiveTrack(null); setActiveCert(null); onEnrollClick(codes); };

  return (
    <section id="programmes" className="section section-alt" data-component="CertificationPortfolio"
      aria-labelledby="prog-heading">
      <div className="section-inner">
        <div className="section-hdr rv">
          <div className="eyebrow"><span data-t="prog.eyebrow">{t('prog.eyebrow')}</span></div>
          <h2 className="section-h" id="prog-heading" data-t="prog.h2">{t('prog.h2')}</h2>
          <p className="section-sub rv" data-t="prog.sub">{t('prog.sub')}</p>
        </div>

        {loading && (
          <div className="prog-grid" aria-busy="true" aria-label="Loading programmes">
            {[0,1,2,3].map(i => <div key={i} className="prog-skeleton"/>)}
          </div>
        )}

        {error && (
          <div role="alert" className="prog-error">
            <p>Unable to load programmes.{' '}
              <a href="mailto:academy@solvagence.com">academy@solvagence.com</a>
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="prog-grid" role="list">
            {tracks.map(track => (
              <div key={track.trackId} role="listitem">
                <TrackCard track={track} onOpen={() => handleOpenTrack(track)}/>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTrack && (
        <TrackModal
          track={activeTrack}
          onClose={() => setActiveTrack(null)}
          onViewCert={handleOpenDrawer}
          onEnroll={handleEnroll}
        />
      )}

      {activeCert && (
        <CurriculumDrawer
          cert={activeCert}
          onClose={() => setActiveCert(null)}
          onEnroll={handleEnroll}
        />
      )}
    </section>
  );
};

export default CertificationPortfolio;
