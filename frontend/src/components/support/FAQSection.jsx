import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const FAQ_EN = [
  { q:'Who are the programmes designed for?', a:'Practising professionals with 3+ years of experience in technology, business, or leadership. No prior AI knowledge needed for the Foundations certificate.' },
  { q:'What is the format and duration?', a:'Each certification is a 2-day intensive — 16 contact hours. Available in-person (DIFC, Dubai) and live virtual.' },
  { q:'Is there a group discount?', a:'Yes. 2–5 seats: 10% discount. 6–14 seats: 20% discount. 15+: contact leaders@solvagence.com for enterprise pricing.' },
  { q:'Are these externally accredited?', a:'Solvagence certifications are professional credentials issued by Solvagence Global AI Academy. External accreditation applications are in progress.' },
  { q:'What is the refund policy?', a:'14+ days notice: full refund. 7–13 days: 50% refund or free transfer. Less than 7 days: no refund; seat may be transferred.' },
  { q:'Can I enrol in multiple certifications?', a:'Yes. Enrolling in 2+ certifications at once qualifies for a 5% bundle discount.' },
  { q:'Do you offer invoicing?', a:'Yes. Invoice and LPO payment available for corporate enrollments. Contact academy@solvagence.com.' },
];

const FAQ_AR = [
  { q:'لمن صُمِّمت هذه البرامج؟', a:'للمحترفين الممارسين ذوي الخبرة 3+ سنوات في مجالات التقنية أو الأعمال أو القيادة.' },
  { q:'ما هو التنسيق والمدة؟', a:'كل شهادة تُقدَّم كبرنامج مكثف مدته يومان — 16 ساعة تدريبية. متاح حضورياً وافتراضياً.' },
  { q:'هل يوجد خصم للمجموعات؟', a:'نعم. 2–5 مقاعد: خصم 10٪. 6–14 مقعداً: خصم 20٪. 15+ مقعداً: تواصل مع leaders@solvagence.com.' },
  { q:'هل الشهادات معتمدة خارجياً؟', a:'شهادات سولفاجنس هي اعتمادات مهنية صادرة عن الأكاديمية. طلبات الاعتماد الخارجي جارية.' },
  { q:'ما سياسة الاسترداد؟', a:'إشعار 14+ يوماً: استرداد كامل. 7–13 يوماً: استرداد 50٪. أقل من 7 أيام: لا استرداد.' },
  { q:'هل يمكنني التسجيل في أكثر من شهادة؟', a:'نعم. التسجيل في شهادتين أو أكثر في نفس الوقت يؤهلك للحصول على خصم حزمة بنسبة 5٪.' },
  { q:'هل توفرون الفوترة؟', a:'نعم. تتوفر الفواتير والدفع عبر أمر الشراء لتسجيل الشركات. تواصل عبر academy@solvagence.com.' },
];

const FAQSection = () => {
  const { t, isAr } = useTranslation();
  const [open, setOpen] = useState(null);
  const faqs = isAr ? FAQ_AR : FAQ_EN;

  return (
    <section id="faq" className="section section-alt" data-component="FAQSection" aria-labelledby="faq-heading">
      <div className="section-inner">
        <div className="section-hdr rv">
          <div className="eyebrow"><span data-t="faq.eyebrow">{t('faq.eyebrow')}</span></div>
          <h2 className="section-h" id="faq-heading" data-t="faq.h2">{t('faq.h2')}</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className={`faq-item rv${open===i?' open':''}`}>
              <button className="faq-trigger" onClick={() => setOpen(open===i?null:i)}
                aria-expanded={open===i} aria-controls={`faq-body-${i}`}>
                <span>{faq.q}</span>
                <span className="faq-icon" aria-hidden="true">{open===i?'−':'+'}</span>
              </button>
              <div id={`faq-body-${i}`} className="faq-body" style={{ maxHeight: open===i?'500px':'0' }}>
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
