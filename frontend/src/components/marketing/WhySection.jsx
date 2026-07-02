import { useTranslation } from '../../hooks/useTranslation';

const ITEMS = [
  { icon:'⚡', en:{ h:'Practitioner-Led', p:'Every instructor is a working enterprise AI professional. No theory for its own sake — only what works at scale.' }, ar:{ h:'بقيادة ممارسين', p:'كل مدرّب محترف نشط في الذكاء الاصطناعي المؤسسي.' }},
  { icon:'🎯', en:{ h:'Applied Learning', p:'70% of each programme is applied — case studies, workshops, live build sessions, and real enterprise scenarios.' }, ar:{ h:'تعلم تطبيقي', p:'70٪ من كل برنامج تطبيقي.' }},
  { icon:'🌍', en:{ h:'GCC and Global Context', p:'Curriculum built for the GCC digital transformation context — with global applicability and DIFC-based delivery.' }, ar:{ h:'سياق خليجي وعالمي', p:'منهج مبني لسياق التحول الرقمي الخليجي مع قابلية التطبيق العالمي.' }},
  { icon:'📋', en:{ h:'Compact and Dense', p:'2 days, not 2 weeks. Maximum signal, minimum time. For executives who cannot disappear for extended programmes.' }, ar:{ h:'مضغوط ومكثف', p:'يومان لا أسبوعان. للمسؤولين التنفيذيين.' }},
];

const WhySection = () => {
  const { t, isAr } = useTranslation();
  return (
    <section id="why-us" className="section section-alt" data-component="WhySection"
      aria-labelledby="why-heading">
      <div className="section-inner">
        <div className="section-hdr rv">
          <div className="eyebrow"><span data-t="why.eyebrow">{t('why.eyebrow')}</span></div>
          <h2 className="section-h" id="why-heading" data-t="why.h2">{t('why.h2')}</h2>
          <p className="section-sub" data-t="why.sub">{t('why.sub')}</p>
        </div>
        <div className="why-grid">
          {ITEMS.map((item, i) => {
            const loc = isAr ? item.ar : item.en;
            return (
              <div key={i} className="why-card rv">
                <div className="why-icon" aria-hidden="true">{item.icon}</div>
                <h3 className="why-h">{loc.h}</h3>
                <p className="why-p">{loc.p}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
