import { useTranslation } from '../../hooks/useTranslation';

const STEPS = [
  ['path.s1.tag', 'path.s1.name', 'path.s1.desc'],
  ['path.s2.tag', 'path.s2.name', 'path.s2.desc'],
  ['path.s3.tag', 'path.s3.name', 'path.s3.desc'],
  ['path.s4.tag', 'path.s4.name', 'path.s4.desc'],
];

const TAGS = ['path.t1', 'path.t2', 'path.t3', 'path.t4', 'path.t5', 'path.t6', 'path.t7', 'path.t8'];

const LearningPathway = () => {
  const { t } = useTranslation();

  return (
    <section id="pathway" className="section section-alt" data-component="LearningPathway" aria-labelledby="path-heading">
      <div className="section-inner">
        <div className="eyebrow"><span>{t('path.eyebrow')}</span></div>
        <h2 id="path-heading" className="section-h rv">{t('path.h2')}</h2>
        <div className="path-layout">
          <div className="path-steps">
            <ol aria-label="Recommended learning progression">
              {STEPS.map(([tag, name, desc], index) => (
                <li key={tag}>
                  <div className="pw-node rv">
                    <div className="pw-spine" aria-hidden="true">
                      <div className={`pw-dot${index === STEPS.length - 1 ? ' dim' : ''}`} />
                      {index !== STEPS.length - 1 && <div className={`pw-line${index === STEPS.length - 2 ? ' dim' : ''}`} />}
                    </div>
                    <div className="pw-body">
                      <div className={`pw-tag${index === STEPS.length - 1 ? ' dim' : ''}`}>{t(tag)}</div>
                      <div className="pw-name">{t(name)}</div>
                      <p className="pw-desc">{t(desc)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <aside className="path-panel rv" aria-label="Programme philosophy">
            <p className="path-quote">{t('path.quote')}</p>
            <p className="path-body">{t('path.body')}</p>
            <div className="tags">
              {TAGS.map(tag => <span className="tag" key={tag}>{t(tag)}</span>)}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default LearningPathway;
