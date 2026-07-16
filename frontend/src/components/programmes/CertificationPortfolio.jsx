import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import useCertifications from '../../hooks/useCertifications';
import TrackCard from './TrackCard';
import TrackModal from './TrackModal';
import CurriculumDrawer from './CurriculumDrawer';

const CertificationPortfolio = ({ onEnrollClick }) => {
  const { t, isAr } = useTranslation();
  const { tracks, loading, error } = useCertifications();
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeCert,  setActiveCert]  = useState(null);
  const certs = tracks.flatMap(track => track.certifications || []);
  const allCodes = certs.map(cert => cert.code);
  const bundlePrice = Math.round(certs.reduce((sum, cert) => sum + (cert.priceUSD || 0), 0) * 0.95);

  const handleOpenTrack  = track  => setActiveTrack(track);
  const handleOpenDrawer = cert   => { setActiveTrack(null); setActiveCert(cert); };
  const handleEnroll     = (codes, cohort = 'individual') => { setActiveTrack(null); setActiveCert(null); onEnrollClick(codes, cohort); };

  return (
    <section id="programmes" className="section section-alt track-portfolio" data-component="CertificationPortfolio"
      aria-labelledby="prog-heading">
      <div className="section-inner">
        <div className="section-top">
          <div>
            <div className="eyebrow"><span data-t="prog.eyebrow">{t('prog.eyebrow')}</span></div>
            <h2 className="section-h rv" id="prog-heading" data-t="prog.h2">{t('prog.h2')}</h2>
          </div>
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

        {!loading && !error && tracks.length > 0 && (
          <>
            <div className="master-track rv" role="region" aria-labelledby="master-track-heading">
              <div className="master-track-left">
                <div className="master-track-badge">
                  <span aria-hidden="true">★</span>
                  <span data-t="track.master.badge">{t('track.master.badge')}</span>
                </div>
                <h3 className="master-track-name" id="master-track-heading" data-t="track.master.name">
                  {t('track.master.name')}
                </h3>
                <p className="master-track-desc" data-t="track.master.desc">{t('track.master.desc')}</p>
                <div className="master-track-meta">
                  <div className="mt-stat"><div className="mt-stat-n">{certs.length}</div><div className="mt-stat-l">{isAr ? 'شهادات' : 'Certifications'}</div></div>
                  <div className="mt-stat"><div className="mt-stat-n">{tracks.length}</div><div className="mt-stat-l">{isAr ? 'مسارات' : 'Tracks'}</div></div>
                  <div className="mt-stat"><div className="mt-stat-n">12</div><div className="mt-stat-l">{isAr ? 'أيام مكثفة' : 'Days Intensive'}</div></div>
                  <div className="mt-stat"><div className="mt-stat-n">5%</div><div className="mt-stat-l">{isAr ? 'توفير الحزمة' : 'Bundle Saving'}</div></div>
                </div>
              </div>
              <div className="master-track-actions">
                <div className="master-track-price">
                  <span data-t="prog.from">{t('prog.from')}</span> <strong>${bundlePrice.toLocaleString()}</strong>{' '}
                  <span className="bundle-note">({t('track.master.bundle')})</span>
                </div>
                <button className="btn btn-em btn-full" onClick={() => handleEnroll(allCodes)}>
                  <span data-t="track.master.enroll">{t('track.master.enroll')}</span>
                  <span aria-hidden="true">→</span>
                </button>
                <button className="btn btn-ghost btn-full" onClick={() => handleEnroll(allCodes, 'team')}>
                  <span>{t('foot.l.grp')}</span>
                </button>
              </div>
            </div>

            <div className="tracks-grid rv" role="list" aria-label="Learning tracks">
            {tracks.map(track => (
              <TrackCard key={track.trackId} track={track} onOpen={() => handleOpenTrack(track)}/>
            ))}
            </div>
          </>
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
