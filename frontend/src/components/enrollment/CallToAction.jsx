import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const GUIDE = 'mailto:academy@solvagence.com?subject=Enrollment%20Guide%20Request&body=Please%20send%20me%20the%20enrollment%20guide.%0A%0AName%3A%20%0AOrganisation%3A%20';

const CallToAction = ({ onEnrollClick }) => {
  const { t } = useTranslation();
  return (
    <section id="contact" className="section cta-sect" data-component="CallToAction"
      aria-labelledby="cta-heading">
      <div className="section-inner cta-inner">
        <div className="eyebrow"><span data-t="cta.eyebrow">{t('cta.eyebrow')}</span></div>
        <h2 className="section-h" id="cta-heading">
          <span data-t="cta.h2.a">{t('cta.h2.a')}</span>{' '}
          <span data-t="cta.h2.b">{t('cta.h2.b')}</span>
        </h2>
        <p className="section-sub rv" data-t="cta.sub">{t('cta.sub')}</p>
        <div className="cta-actions rv">
          <button className="btn-em cta-main-btn" onClick={onEnrollClick} data-t="cta.ind">
            {t('cta.ind')}
          </button>
          <a href={GUIDE} className="btn-ghost" data-t="foot.l.guide">{t('foot.l.guide')}</a>
        </div>
      </div>
    </section>
  );
};

CallToAction.propTypes = { onEnrollClick: PropTypes.func.isRequired };
export default CallToAction;
