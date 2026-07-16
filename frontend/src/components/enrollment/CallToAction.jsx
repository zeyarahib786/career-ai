import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const PARTNERSHIP =
  'mailto:leaders@solvagence.com?subject=Partnership%20Enquiry%20%E2%80%94%20Solvagence%20Global%20AI%20Academy%20%28July%202026%29';

const CallToAction = ({ onEnrollClick }) => {
  const { t } = useTranslation();
  return (
    <section className="cta-section" data-component="CallToAction"
      aria-labelledby="cta-heading">
      <div className="cta-inner">
        <div className="cta-copy">
          <div className="eyebrow"><span data-t="cta.eyebrow">{t('cta.eyebrow')}</span></div>
          <h2 className="cta-h rv" id="cta-heading">
            <span data-t="cta.h2.a">{t('cta.h2.a')}</span><br/>
            <em data-t="cta.h2.b">{t('cta.h2.b')}</em>
          </h2>
          <p className="cta-p rv" data-t="cta.sub">{t('cta.sub')}</p>
          <div className="cta-actions rv">
            <button className="btn btn-em" onClick={() => onEnrollClick('individual')} data-t="cta.ind">{t('cta.ind')}</button>
            <button className="btn btn-ghost" onClick={() => onEnrollClick('team')} data-t="cta.grp">{t('cta.grp')}</button>
            <a href={PARTNERSHIP} className="btn btn-mono" data-t="cta.prt">{t('cta.prt')}</a>
          </div>
        </div>
        <aside className="cta-box rv" aria-labelledby="cta-box-h">
          <div className="cta-box-title" id="cta-box-h" data-t="cta.box.title">{t('cta.box.title')}</div>
          <ul className="cta-list" role="list">
            {[1,2,3,4,5,6,7].map(i => <li className="cta-li" key={i}>{t(`cta.i${i}`)}</li>)}
          </ul>
          <button className="btn btn-em btn-full" onClick={() => onEnrollClick('individual')}>
            <span data-t="opt.ind.cta">{t('opt.ind.cta')}</span> <span aria-hidden="true">→</span>
          </button>
        </aside>
      </div>
    </section>
  );
};

CallToAction.propTypes = { onEnrollClick: PropTypes.func.isRequired };
export default CallToAction;
