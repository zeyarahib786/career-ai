import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { enrollmentService, pricingService } from '../../services/api';
import PropTypes from 'prop-types';

const CERTS_META = [
  { code:'SGA-01', label:'AI/ML & Generative AI Foundations',          price:1495, track:'t1' },
  { code:'SGA-02', label:'AI-Driven Development Professional',         price:1795, track:'t2' },
  { code:'SGA-03', label:'Contextual Engineering Professional',        price:1895, track:'t2' },
  { code:'SGA-04', label:'AI Use Cases Implementation',                price:1695, track:'t3' },
  { code:'SGA-05', label:'Agentic AI & AI-Native Professional',        price:1995, track:'t4' },
  { code:'SGA-06', label:'DevAIOps Professional',                      price:1795, track:'t4' },
];

const COUNTRIES = [
  {code:'AE',label:'UAE 🇦🇪'},{code:'SA',label:'Saudi Arabia 🇸🇦'},
  {code:'QA',label:'Qatar 🇶🇦'},{code:'KW',label:'Kuwait 🇰🇼'},
  {code:'BH',label:'Bahrain 🇧🇭'},{code:'OM',label:'Oman 🇴🇲'},
  {code:'GB',label:'United Kingdom 🇬🇧'},{code:'US',label:'United States 🇺🇸'},
  {code:'IN',label:'India 🇮🇳'},{code:'SG',label:'Singapore 🇸🇬'},{code:'OTHER',label:'Other'},
];

const INIT = {
  firstName:'',lastName:'',email:'',phone:'',country:'',
  jobTitle:'',organisation:'',industry:'',yearsExperience:'',
  linkedInUrl:'',howHeard:'',learningGoals:'',
  dataConsent:false,marketingConsent:false,
  certificationCodes:[],cohortType:'individual',seats:1,
};

const EnrollmentModal = ({ isOpen, onClose, preselectedCodes = [] }) => {
  const { t, locale }    = useTranslation();
  const [step, setStep]  = useState(1);
  const [form, setForm]  = useState(INIT);
  const [errors, setErrors] = useState({});
  const [pricing, setPricing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed]   = useState(null);
  const closeRef = useRef(null);
  const effectiveSeats = form.cohortType === 'team'
    ? Math.max(parseInt(form.seats, 10) || 2, 2)
    : 1;

  useEffect(() => {
    if (isOpen && preselectedCodes.length)
      setForm(f => ({ ...f, certificationCodes: preselectedCodes }));
  }, [isOpen, preselectedCodes]);

  // Recalculate pricing
  useEffect(() => {
    if (!form.certificationCodes.length) { setPricing(null); return; }
    const t = setTimeout(async () => {
      try {
        const res = await pricingService.calculate({
          certificationCodes: form.certificationCodes,
          seats: effectiveSeats, cohortType: form.cohortType, country: form.country,
        });
        setPricing(res.data.data);
      } catch { setPricing(null); }
    }, 400);
    return () => clearTimeout(t);
  }, [form.certificationCodes, effectiveSeats, form.cohortType, form.country]);

  // Focus and keyboard
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 350);
    const onKey = e => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [isOpen]);

  const change = useCallback(e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type==='checkbox' ? checked : value }));
    setErrors(er => ({ ...er, [name]: undefined }));
  }, []);

  const toggleCert = code => {
    setForm(f => ({
      ...f,
      certificationCodes: f.certificationCodes.includes(code)
        ? f.certificationCodes.filter(c => c !== code)
        : [...f.certificationCodes, code],
    }));
  };

  const validate1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = t('val.fn') || 'Required';
    if (!form.lastName.trim())  e.lastName  = t('val.ln') || 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('val.em') || 'Valid email required';
    if (!form.phone.trim())     e.phone     = t('val.ph') || 'Required';
    if (!form.country)          e.country   = t('val.co') || 'Required';
    if (!form.jobTitle.trim())  e.jobTitle  = t('val.jt') || 'Required';
    if (!form.organisation.trim()) e.organisation = t('val.org') || 'Required';
    if (!form.dataConsent)      e.dataConsent = t('val.dc') || 'Required';
    setErrors(e); return !Object.keys(e).length;
  };

  const validate2 = () => {
    if (!form.certificationCodes.length) { setErrors({ certs:'Select at least one certification' }); return false; }
    return true;
  };

  const next = () => {
    if (step === 1 && !validate1()) return;
    if (step === 2 && !validate2()) return;
    setStep(s => Math.min(s+1, 3));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await enrollmentService.create({
        ...form, seats: effectiveSeats, dataConsent:String(form.dataConsent), locale,
      });
      setConfirmed(res.data.data);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally { setSubmitting(false); }
  };

  const handleClose = () => {
    setStep(1); setForm(INIT); setConfirmed(null); setErrors({}); onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="modalOv" className="modal-ov open" role="dialog" aria-modal="true"
      aria-labelledby="modal-heading" onClick={e => e.target===e.currentTarget && handleClose()}>
      <div className="modal-box" data-component="EnrollmentModal">
        {/* Header */}
        <div className="modal-head">
          <div>
            <span className="modal-eyebrow" data-t="modal.enroll">{t('modal.enroll')}</span>
            {!confirmed && (
              <div className="modal-steps" role="list" aria-label={`Step ${step} of 3`}>
                {[1,2,3].map(n => (
                  <div key={n} role="listitem"
                    className={`modal-step${step===n?' active':''} ${step>n?'done':''}`}
                    aria-current={step===n ? 'step' : undefined}>
                    <span className="step-label" data-t={`modal.step${n}`}>{t(`modal.step${n}`)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button ref={closeRef} className="modal-close-btn" onClick={handleClose}
            aria-label={t('modal.close') || 'Close'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div id="modalScroll" className="modal-scroll">
          {/* ── Confirmed ── */}
          {confirmed && (
            <div className="modal-confirm" id="mp4">
              <div className="conf-check">✓</div>
              <h2 className="conf-h" id="modal-heading" tabIndex={-1}>
                {t('conf.title') || 'Enrollment Confirmed!'}
              </h2>
              <div className="conf-ref">
                {t('conf.ref') || 'Reference'}: <strong>{confirmed.reference}</strong>
              </div>
              <p className="conf-msg">{t('conf.msg') || 'Confirmation sent to your email. Our team will be in touch shortly.'}</p>
              <button className="btn-em" onClick={handleClose}>{t('modal.close')||'Close'}</button>
            </div>
          )}

          {/* ── Step 1: Personal Details ── */}
          {!confirmed && step === 1 && (
            <div id="mp1" className="modal-panel active">
              <div className="mp-form-grid">
                {[['firstName',t('form.fn')||'First Name','text'],
                  ['lastName',t('form.ln')||'Last Name','text'],
                  ['email',t('form.em')||'Work Email','email',true],
                  ['phone',t('form.ph')||'Phone','tel'],
                  ['jobTitle',t('form.jt')||'Job Title','text'],
                  ['organisation',t('form.org')||'Organisation','text'],
                ].map(([name,label,type,full]) => (
                  <div key={name} className={`mp-field${full?' full':''}`}>
                    <label className="mp-label" htmlFor={`f_${name}`}>{label}</label>
                    <input id={`f_${name}`} name={name} type={type}
                      value={form[name]} onChange={change}
                      className={`mp-input${errors[name]?' error':''}`}
                      aria-invalid={!!errors[name]}
                      aria-describedby={errors[name]?`fe_${name}`:undefined}/>
                    {errors[name] && <span id={`fe_${name}`} className="mp-error" role="alert">{errors[name]}</span>}
                  </div>
                ))}

                <div className="mp-field full">
                  <label className="mp-label" htmlFor="f_country">{t('form.co')||'Country'}</label>
                  <select id="f_country" name="country" value={form.country} onChange={change}
                    className={`mp-input${errors.country?' error':''}`}>
                    <option value="">{t('sel.placeholder')||'— Select country —'}</option>
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  {errors.country && <span className="mp-error" role="alert">{errors.country}</span>}
                </div>

                <div className="mp-field full mp-consent">
                  <label className="mp-consent-lbl">
                    <input type="checkbox" name="dataConsent" checked={form.dataConsent}
                      onChange={change} className={errors.dataConsent?'error':''}/>
                    <span>{t('form.consent')||'I consent to my data being processed for enrollment administration'}{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer"
                        style={{color:'var(--em)'}}>Privacy Policy</a>
                    </span>
                  </label>
                  {errors.dataConsent && <span className="mp-error" role="alert">{errors.dataConsent}</span>}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Programme Selection ── */}
          {!confirmed && step === 2 && (
            <div id="mp2" className="modal-panel active">
              <div id="progList" className="prog-list">
                {CERTS_META.map(cert => {
                  const sel = form.certificationCodes.includes(cert.code);
                  return (
                    <label key={cert.code} className={`pl-row${sel?' on':''}`}>
                      <input type="checkbox" checked={sel} onChange={() => toggleCert(cert.code)}
                        aria-label={`${cert.label} — $${cert.price.toLocaleString()}`}/>
                      <span className="pl-vis" aria-hidden="true"/>
                      <div className="pl-info">
                        <div className="pl-name">{cert.label}</div>
                        <div className="pl-meta">{cert.code}</div>
                      </div>
                      <span className="pl-price">${cert.price.toLocaleString()}</span>
                    </label>
                  );
                })}
                {errors.certs && <p className="mp-error" role="alert">{errors.certs}</p>}
              </div>

              {/* Cohort type */}
              <fieldset className="ct-fieldset">
                <legend className="sr-only">Enrollment type</legend>
                <div className="ct-row">
                      {['individual','team'].map(ct => (
                    <button key={ct} type="button" className={`ct-btn${form.cohortType===ct?' on':''}`}
                      onClick={() => setForm(f=>({...f,cohortType:ct,seats:ct==='team' ? Math.max(parseInt(f.seats,10)||2,2) : 1}))}
                      aria-pressed={form.cohortType===ct}
                      data-t={`opt.${ct.slice(0,3)}.title`}>
                      {t(`opt.${ct.slice(0,3)}.title`) || ct}
                    </button>
                  ))}
                </div>
              </fieldset>

              {form.cohortType === 'team' && (
                <div id="teamRow" className="mp-field">
                  <label className="mp-label" htmlFor="f_seats">{t('opt.seats.label')||'Number of seats'}</label>
                  <input id="f_seats" name="seats" type="number" min="2" max="100"
                    value={form.seats} onChange={change} className="mp-input"
                    style={{maxWidth:'120px'}}/>
                </div>
              )}

              {pricing && <PricingBox p={pricing} t={t}/>}
            </div>
          )}

          {/* ── Step 3: Review & Confirm ── */}
          {!confirmed && step === 3 && (
            <div id="mp3" className="modal-panel active">
              <div className="order-summary">
                <h3 className="os-h">{t('modal.step3')||'Review & Confirm'}</h3>
                <div className="os-section">
                  <div className="os-label">{t('form.fn')||'Name'}</div>
                  <div>{form.firstName} {form.lastName}</div>
                  <div>{form.email}</div>
                  <div>{form.jobTitle} — {form.organisation}</div>
                </div>
                <div className="os-section">
                  <div className="os-label">Programmes</div>
                  {form.certificationCodes.map(c => {
                    const meta = CERTS_META.find(m => m.code === c);
                    return <div key={c}>{c} — {meta?.label}</div>;
                  })}
                </div>
                <div className="os-section">
                  <div className="os-label">Enrollment</div>
                  <div>{form.cohortType === 'team' ? `Team · ${form.seats} seats` : 'Individual'}</div>
                </div>
                {pricing && <PricingBox p={pricing} t={t}/>}
                {errors.submit && <p className="mp-error" role="alert">{errors.submit}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!confirmed && (
          <div id="modalFoot" className="modal-foot">
            <div className="mf-secure">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <span data-t="modal.secure">{t('modal.secure')}</span>
            </div>
            <div className="mf-nav">
              {step > 1 && (
                <button className="btn-ghost" onClick={() => setStep(s=>s-1)}
                  data-t="modal.back">{t('modal.back')}</button>
              )}
              {step < 3 && (
                <button className="btn-em" onClick={next}
                  data-t={`modal.next${step}`}>{t(`modal.next${step}`)}</button>
              )}
              {step === 3 && (
                <button className="btn-em" onClick={submit} disabled={submitting}>
                  {submitting ? (t('modal.processing')||'Processing…') : (t('modal.next3')||'Submit Enrollment')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PricingBox = ({ p, t }) => (
  <div className="price-box">
    <div className="pb-row"><span>{p.certCount} cert{p.certCount>1?'s':''} × {p.seats} seat{p.seats>1?'s':''}</span><span>${p.subtotalUSD?.toLocaleString()}</span></div>
    {p.bundleAmountUSD>0 && <div className="pb-row pb-disc"><span>Bundle 5%</span><span>-${p.bundleAmountUSD?.toLocaleString()}</span></div>}
    {p.teamAmountUSD>0   && <div className="pb-row pb-disc"><span>Team {Math.round(p.teamRate*100)}%</span><span>-${p.teamAmountUSD?.toLocaleString()}</span></div>}
    {p.vatAmountUSD>0    && <div className="pb-row"><span>{t('opt.vat.label')||'UAE VAT 5%'}</span><span>${p.vatAmountUSD?.toLocaleString()}</span></div>}
    <div className="pb-total"><span>{t('opt.total')||'Total'}</span><span>${p.totalUSD?.toLocaleString()} USD</span></div>
  </div>
);

EnrollmentModal.propTypes = {
  isOpen:          PropTypes.bool.isRequired,
  onClose:         PropTypes.func.isRequired,
  preselectedCodes:PropTypes.arrayOf(PropTypes.string),
};

export default EnrollmentModal;
