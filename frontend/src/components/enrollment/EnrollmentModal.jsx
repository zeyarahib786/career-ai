import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { enrollmentService, pricingService } from '../../services/api';
import PropTypes from 'prop-types';

const CERTS_META = [
  { code: 'SGA-01', n: '01', meta: 'Foundations', metaAr: 'الأساسيات', label: 'AI/ML & Generative AI Foundations', labelKey: 'prog.name1', price: 1495, icon: '⬡' },
  { code: 'SGA-02', n: '02', meta: 'Engineering', metaAr: 'الهندسة', label: 'AI-Driven Development Professional', labelKey: 'prog.name2', price: 1795, icon: '◈' },
  { code: 'SGA-03', n: '03', meta: 'Architecture', metaAr: 'البنية', label: 'Contextual Engineering Professional', labelKey: 'prog.name3', price: 1895, icon: '◎' },
  { code: 'SGA-04', n: '04', meta: 'Implementation', metaAr: 'التطبيق', label: 'AI Use Cases Implementation', labelKey: 'prog.name4', price: 1695, icon: '◇' },
  { code: 'SGA-05', n: '05', meta: 'Agentic AI', metaAr: 'الذكاء الفاعل', label: 'Agentic AI & AI-Native Professional', labelKey: 'prog.name5', price: 1995, icon: '◎' },
  { code: 'SGA-06', n: '06', meta: 'Operations', metaAr: 'العمليات', label: 'DevAIOps Professional', labelKey: 'prog.name6', price: 1795, icon: '⬢' },
];

const ALL_CERT_CODES = CERTS_META.map(cert => cert.code);
const FULL_PROGRAMME_PRICE = CERTS_META.reduce((sum, cert) => sum + cert.price, 0);

const COUNTRIES = [
  ['ae', 'United Arab Emirates'], ['sa', 'Saudi Arabia'], ['qa', 'Qatar'],
  ['kw', 'Kuwait'], ['bh', 'Bahrain'], ['om', 'Oman'], ['gb', 'United Kingdom'],
  ['us', 'United States'], ['in', 'India'], ['sg', 'Singapore'], ['eg', 'Egypt'],
  ['jo', 'Jordan'], ['pk', 'Pakistan'], ['de', 'Germany'], ['au', 'Australia'],
  ['ca', 'Canada'], ['fr', 'France'], ['other', 'Other'],
];

const INIT = {
  firstName: '', lastName: '', email: '', phone: '', country: '',
  jobTitle: '', organisation: '', industry: '', yearsExperience: '',
  linkedInUrl: '', howHeard: '', learningGoals: '', qualification: '',
  dataConsent: true, marketingConsent: false,
  certificationCodes: [], cohortType: 'individual', seats: 1,
};

const EnrollmentModal = ({ isOpen, onClose, preselectedCodes = [], initialCohort = 'individual' }) => {
  const { t, locale, isAr } = useTranslation();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [pricing, setPricing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const closeRef = useRef(null);

  const effectiveSeats = form.cohortType === 'team'
    ? Math.max(parseInt(form.seats, 10) || 2, 2)
    : 1;

  const selectedCerts = useMemo(
    () => CERTS_META.filter(cert => form.certificationCodes.includes(cert.code)),
    [form.certificationCodes],
  );
  const allSelected = selectedCerts.length === CERTS_META.length;

  const localPricing = useMemo(() => {
    const subtotal = selectedCerts.reduce((sum, cert) => sum + cert.price, 0) * effectiveSeats;
    const bundle = selectedCerts.length >= 2 ? subtotal * 0.05 : 0;
    const teamRate = form.cohortType === 'team' ? (effectiveSeats >= 6 ? 0.2 : 0.1) : 0;
    const team = (subtotal - bundle) * teamRate;
    const total = subtotal - bundle - team;
    return { subtotal, bundle, team, total, teamRate };
  }, [selectedCerts, effectiveSeats, form.cohortType]);

  useEffect(() => {
    if (!isOpen) return;
    setForm(f => ({
      ...f,
      cohortType: initialCohort,
      seats: initialCohort === 'team' ? Math.max(parseInt(f.seats, 10) || 2, 2) : 1,
      certificationCodes: preselectedCodes.length ? preselectedCodes : f.certificationCodes,
    }));
  }, [isOpen, preselectedCodes, initialCohort]);

  useEffect(() => {
    if (!form.certificationCodes.length) { setPricing(null); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await pricingService.calculate({
          certificationCodes: form.certificationCodes,
          seats: effectiveSeats,
          cohortType: form.cohortType,
          country: form.country,
        });
        setPricing(res.data.data);
      } catch {
        setPricing(null);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [form.certificationCodes, effectiveSeats, form.cohortType, form.country]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    setTimeout(() => closeRef.current?.focus(), 150);
    const onKey = e => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const change = useCallback(e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    setErrors(er => ({ ...er, [name]: undefined }));
  }, []);

  const setCohort = cohortType => {
    setForm(f => ({
      ...f,
      cohortType,
      seats: cohortType === 'team' ? Math.max(parseInt(f.seats, 10) || 2, 2) : 1,
    }));
  };

  const toggleCert = code => {
    setForm(f => ({
      ...f,
      certificationCodes: f.certificationCodes.includes(code)
        ? f.certificationCodes.filter(c => c !== code)
        : [...f.certificationCodes, code],
    }));
    setErrors(er => ({ ...er, certs: undefined }));
  };

  const toggleAllCerts = () => {
    setForm(f => ({
      ...f,
      certificationCodes: f.certificationCodes.length === CERTS_META.length ? [] : ALL_CERT_CODES,
    }));
    setErrors(er => ({ ...er, certs: undefined }));
  };

  const validateProgrammes = () => {
    if (!form.certificationCodes.length) {
      setErrors({ certs: t('modal.needsel') || 'Please select at least one programme to continue.' });
      return false;
    }
    return true;
  };

  const validateDetails = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = t('val.fn') || 'Required';
    if (!form.lastName.trim()) e.lastName = t('val.ln') || 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('val.em') || 'Valid email required';
    if (!form.phone.trim()) e.phone = t('val.ph') || 'Required';
    if (!form.country) e.country = t('val.co') || 'Required';
    if (!form.jobTitle.trim()) e.jobTitle = t('val.jt') || 'Required';
    if (!form.organisation.trim()) e.organisation = t('val.org') || 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const goNext = async () => {
    if (step === 1 && !validateProgrammes()) return;
    if (step === 2 && !validateDetails()) return;
    if (step < 3) {
      setStep(s => s + 1);
      return;
    }
    setSubmitting(true);
    try {
      const res = await enrollmentService.create({
        ...form,
        seats: effectiveSeats,
        dataConsent: 'true',
        locale,
      });
      setConfirmed(res.data.data);
      setStep(4);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setForm(INIT);
    setConfirmed(null);
    setErrors({});
    onClose();
  };

  const displayTotal = localPricing.total;
  const discount = localPricing.bundle + localPricing.team;
  const certLabel = cert => t(cert.labelKey) || cert.label;
  const certMeta = cert => isAr ? cert.metaAr : cert.meta;
  const selectionFormula = () => {
    const certCount = selectedCerts.length;
    const certText = isAr
      ? `${certCount} ${certCount === 1 ? 'شهادة' : 'شهادات'}`
      : `${certCount} certification${certCount === 1 ? '' : 's'}`;
    const seatText = isAr
      ? `${effectiveSeats} ${effectiveSeats === 1 ? 'مقعد' : 'مقاعد'}`
      : `${effectiveSeats} seat${effectiveSeats === 1 ? '' : 's'}`;
    return `${certText} · ${seatText}`;
  };
  const selectedLabel = count => {
    if (!count) return t('modal.none');
    if (allSelected) return isAr ? '✓ تم اختيار جميع البرامج الستة' : '✓ All 6 certifications selected';
    return isAr
      ? `✓ تم اختيار ${count} ${count === 1 ? 'شهادة' : 'شهادات'}`
      : `✓ ${count} certification${count > 1 ? 's' : ''} selected`;
  };
  const money = (amount, suffix = '') => {
    const rounded = Math.round(amount * 10) / 10;
    const hasDecimal = !Number.isInteger(rounded);
    return `$${rounded.toLocaleString(undefined, {
      minimumFractionDigits: hasDecimal ? 1 : 0,
      maximumFractionDigits: 1,
    })}${suffix}`;
  };

  const printReceipt = () => {
    const rows = [
      [t('modal.c.name'), `${form.firstName} ${form.lastName}`],
      [t('modal.c.email'), form.email],
      [t('modal.c.prog'), selectedCerts.map(cert => `${cert.code} — ${certLabel(cert)}`).join(', ')],
      [t('modal.c.seats'), `${effectiveSeats}`],
      [t('modal.c.paid'), money(displayTotal)],
      [t('modal.c.ref'), confirmed?.reference || 'Pending'],
    ];
    const escapeHtml = value => String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    const receipt = window.open('', '_blank', 'width=820,height=720');
    if (!receipt) {
      window.print();
      return;
    }
    receipt.document.write(`<!doctype html>
      <html>
        <head>
          <title>Solvagence Enrollment Receipt</title>
          <style>
            @page { size: A4 portrait; margin: 16mm; }
            * { box-sizing: border-box; }
            body { margin: 0; font-family: Arial, sans-serif; color: #101820; background: #fff; }
            .receipt { max-width: 176mm; margin: 0 auto; padding: 8mm 0; }
            .brand { font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #53677f; margin-bottom: 22px; }
            .check { width: 48px; height: 48px; border: 2px solid #00a878; border-radius: 50%; display: grid; place-items: center; color: #00a878; font-size: 28px; margin: 0 auto 18px; }
            h1 { text-align: center; font-size: 24px; margin: 0 0 10px; }
            .intro { text-align: center; color: #53677f; line-height: 1.55; max-width: 92mm; margin: 0 auto 24px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; border: 1px solid #d8dee8; }
            th, td { padding: 11px 12px; border-bottom: 1px solid #e8edf4; vertical-align: top; font-size: 12px; }
            tr:last-child th, tr:last-child td { border-bottom: 0; }
            th { width: 34%; text-align: left; color: #53677f; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; }
            td { text-align: right; font-weight: 700; color: #101820; }
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .receipt { padding: 0; } }
          </style>
        </head>
        <body>
          <main class="receipt">
            <div class="brand">Solvagence Global AI Academy</div>
            <div class="check">✓</div>
            <h1>${escapeHtml(t('modal.s4h'))}</h1>
            <p class="intro">${escapeHtml(t('modal.s4p'))}</p>
            <table>
              <tbody>
                ${rows.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join('')}
              </tbody>
            </table>
          </main>
          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>`);
    receipt.document.close();
  };

  if (!isOpen) return null;

  return (
    <div id="modalOv" className="modal-overlay open" role="presentation" onClick={e => e.target === e.currentTarget && handleClose()}>
      <div className="modal-box" role="dialog" aria-modal="true" aria-labelledby="mTitle" data-component="EnrollmentModal">
        <div className="modal-bar" aria-hidden="true" />
        <div className="modal-top">
          <div className="modal-brand">
            <img src="/solvagence-logo-transparent.png" alt="" aria-hidden="true" />
            <span className="modal-brand-name" data-t="modal.brand">{t('modal.brand')}</span>
          </div>
          <button ref={closeRef} className="modal-close-btn" onClick={handleClose} aria-label={t('modal.close') || 'Close enrollment form'}>✕</button>
        </div>

        <div className="modal-steps" role="list" aria-label="Enrollment steps">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className={`modal-step${step === n ? ' active' : ''}${step > n ? ' done' : ''}`} aria-current={step === n ? 'step' : undefined}>
              <div className="step-n"><span className="sn-txt">{n}</span></div>
              <span className="step-label" data-t={`modal.step${n}`}>{t(`modal.step${n}`)}</span>
            </div>
          ))}
        </div>

        <div className="modal-scroll" id="modalScroll">
          {step === 1 && (
            <div className="modal-panel active" id="mp1">
              <div className="modal-panel-head">
                <h2 id="mTitle"><span data-t="modal.s1h">{t('modal.s1h')}</span></h2>
                <p><span data-t="modal.s1p">{t('modal.s1p')}</span></p>
              </div>
              <fieldset className="ct-row ct-fieldset">
                <legend className="sr-only">Enrollment type</legend>
                <button type="button" className={`ct-btn${form.cohortType === 'individual' ? ' on' : ''}`} onClick={() => setCohort('individual')} aria-pressed={form.cohortType === 'individual'}>
                  <span data-t="modal.ind">{t('modal.ind')}</span>
                </button>
                <button type="button" className={`ct-btn${form.cohortType === 'team' ? ' on' : ''}`} onClick={() => setCohort('team')} aria-pressed={form.cohortType === 'team'}>
                  <span data-t="modal.team">{t('modal.team')}</span>
                </button>
              </fieldset>
              {form.cohortType === 'team' && (
                <div id="teamRow" aria-live="polite">
                  <p className="ct-note"><span data-t="modal.tnote">{t('modal.tnote')}</span></p>
                  <div className="f-grid">
                    <div className="f-group">
                      <label htmlFor="teamSeats"><span data-t="modal.seats">{t('modal.seats')}</span></label>
                      <input type="number" id="teamSeats" name="seats" min="2" max="200" value={form.seats} onChange={change} />
                    </div>
                  </div>
                </div>
              )}
              {errors.certs && <div id="selNotice" role="alert" style={{ display: 'flex' }}><span aria-hidden="true">⚠</span><span>{errors.certs}</span></div>}
              {selectedCerts.length >= 2 && <div id="bundleBadge" style={{ display: 'flex' }}><span aria-hidden="true">🎁</span><span data-t="modal.bundle">{t('modal.bundle')}</span></div>}
              <div id="progList" role="group" aria-multiselectable="true" aria-label="Select programmes">
                <button
                  type="button"
                  className={`pl-selall${allSelected ? ' on' : ''}`}
                  onClick={toggleAllCerts}
                  aria-pressed={allSelected}
                >
                  <span className="pl-sa-ico" aria-hidden="true">{allSelected ? '✓' : '☐'}</span>
                  <span className="pl-sa-txt">{allSelected ? t('modal.deselall') : t('modal.selall')}</span>
                  <span className="pl-sa-pr">${FULL_PROGRAMME_PRICE.toLocaleString()}</span>
                </button>
                {CERTS_META.map(cert => {
                  const selected = form.certificationCodes.includes(cert.code);
                  return (
                    <div key={cert.code} className={`pl-row${selected ? ' on' : ''}`}>
                      <label className="pl-lbl">
                        <input className="pl-cb" type="checkbox" checked={selected} onChange={() => toggleCert(cert.code)} />
                        <span className="pl-vis" aria-hidden="true">{selected ? '✓' : ''}</span>
                        <span className="pl-ico" aria-hidden="true">{cert.icon}</span>
                        <span className="pl-info">
                          <span className="pl-name">{certLabel(cert)}</span>
                          <span className="pl-meta">{isAr ? `${certMeta(cert)} · ${cert.n}` : `${cert.n} · ${certMeta(cert)}`}</span>
                        </span>
                        <span className="pl-price">${cert.price.toLocaleString()}<small>{t('modal.perseat')}</small></span>
                      </label>
                    </div>
                  );
                })}
              </div>
              <div className="sel-strip">
                <span id="selSummary" aria-live="polite">
                  {selectedLabel(selectedCerts.length)}
                </span>
              </div>
              <div className="price-strip">
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>{selectedCerts.length ? selectionFormula() : (isAr ? 'لا توجد برامج مختارة' : 'No programmes selected')}</span>
                    <strong>{selectedCerts.length ? money(localPricing.subtotal) : '—'}</strong>
                  </div>
                  {localPricing.bundle > 0 && (
                    <div className="price-row discount">
                      <span>{isAr ? 'خصم الحزمة 5%' : 'Bundle 5%'}</span>
                      <strong>-{money(localPricing.bundle)}</strong>
                    </div>
                  )}
                  {localPricing.team > 0 && (
                    <div className="price-row discount">
                      <span>{isAr ? `خصم الفريق ${Math.round(localPricing.teamRate * 100)}%` : `Team ${Math.round(localPricing.teamRate * 100)}%`}</span>
                      <strong>-{money(localPricing.team)}</strong>
                    </div>
                  )}
                  <div className="price-row total">
                    <span data-t="modal.total">{t('modal.total').replace(' Investment', '')}</span>
                    <strong>{selectedCerts.length ? money(displayTotal, ' USD') : '—'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="modal-panel active" id="mp2">
              <div className="modal-panel-head"><h2>{t('modal.s2h')}</h2><p>{t('modal.s2p')}</p></div>
              <div className="f-sep"><span>{t('modal.personal')}</span></div>
              <div className="f-grid">
                <Field name="firstName" label={t('modal.fn')} value={form.firstName} error={errors.firstName} onChange={change} autoComplete="given-name" />
                <Field name="lastName" label={t('modal.ln')} value={form.lastName} error={errors.lastName} onChange={change} autoComplete="family-name" />
              </div>
              <div className="f-grid">
                <Field name="email" label={t('modal.email')} type="email" value={form.email} error={errors.email} onChange={change} autoComplete="email" placeholder="you@company.com" />
                <Field name="phone" label={t('modal.phone')} type="tel" value={form.phone} error={errors.phone} onChange={change} autoComplete="tel" placeholder="+971 50 000 0000" />
              </div>
              <div className="f-grid">
                <div className="f-group">
                  <label htmlFor="country">{t('modal.country')} <span className="req">*</span></label>
                  <select id="country" name="country" value={form.country} onChange={change} aria-invalid={!!errors.country}>
                    <option value="">{t('sel.country') || 'Select country…'}</option>
                    {COUNTRIES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                  </select>
                  {errors.country && <span className="f-error show">{errors.country}</span>}
                </div>
                <Field name="linkedInUrl" label={t('modal.li')} value={form.linkedInUrl} onChange={change} placeholder="linkedin.com/in/yourname" required={false} />
              </div>
              <div className="f-sep"><span>{t('modal.professional')}</span></div>
              <div className="f-grid">
                <Field name="jobTitle" label={t('modal.jt')} value={form.jobTitle} error={errors.jobTitle} onChange={change} autoComplete="organization-title" />
                <Field name="organisation" label={t('modal.org')} value={form.organisation} error={errors.organisation} onChange={change} autoComplete="organization" />
              </div>
              <div className="f-grid tri">
                <SelectField name="industry" label={t('modal.industry')} value={form.industry} onChange={change} options={['Financial Services', 'Technology', 'Healthcare', 'Government', 'Consulting', 'Education', 'Energy', 'Other']} />
                <SelectField name="yearsExperience" label={t('modal.exp')} value={form.yearsExperience} onChange={change} options={['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years']} />
                <SelectField name="qualification" label={t('modal.qual')} value={form.qualification} onChange={change} options={["Bachelor's", "Master's", 'MBA', 'PhD', 'Professional Cert.', 'Other']} />
              </div>
              <div className="f-grid">
                <SelectField name="howHeard" label={t('modal.heard')} value={form.howHeard} onChange={change} options={['LinkedIn', 'Google', 'Colleague / Referral', 'Event', 'Email Newsletter', 'Other']} />
                <div className="f-group">
                  <label htmlFor="learningGoals">{t('modal.goals')} <span>{t('modal.optional')}</span></label>
                  <textarea id="learningGoals" name="learningGoals" rows="2" value={form.learningGoals} onChange={change} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="modal-panel active" id="mp3">
              <div className="modal-panel-head"><h2>{t('modal.s3h')}</h2><p>{t('modal.s3p')}</p></div>
              <div className="sec-row" role="list">
                <div className="sec-item" role="listitem"><span aria-hidden="true">🔒</span><span data-t="sec.ssl">{t('sec.ssl')}</span></div>
                <div className="sec-item" role="listitem"><span aria-hidden="true">🛡️</span><span data-t="sec.gw">{t('sec.gw')}</span></div>
              </div>
              <div className="f-sep"><span>{t('modal.order')}</span></div>
              <div className="order-box">
                <SummaryRow label={t('modal.o.prog')} value={selectedCerts.map(cert => `${cert.code} — ${cert.label}`)} />
                <SummaryRow label={t('modal.o.seats')} value={`${effectiveSeats}`} />
                <SummaryRow label={t('modal.o.sub')} value={money(localPricing.subtotal)} />
                {discount > 0 && <SummaryRow label={t('modal.o.disc')} value={`-${money(discount)}`} highlight />}
                <SummaryRow label={t('modal.o.vat')} value={money(pricing?.vatAmountUSD ?? 0)} />
                <div className="o-row"><span className="o-tot-k">{t('modal.o.total')}</span><span className="o-tot-v">{money(displayTotal)}</span></div>
              </div>
              {/* Payment/card fields removed from the reserve-now/pay-later UI; restore here for future online payments. */}
              {errors.submit && <span className="f-error show" role="alert">{errors.submit}</span>}
              <p className="terms-note">{t('modal.terms')}</p>
            </div>
          )}

          {step === 4 && (
            <div className="modal-panel active" id="mp4">
              <div className="confirm-wrap" role="status" aria-live="polite">
                <div className="confirm-ico" aria-hidden="true">✓</div>
                <h2 className="confirm-h" tabIndex={-1}>{t('modal.s4h')}</h2>
                <p className="confirm-p">{t('modal.s4p')}</p>
                <div className="confirm-details">
                  <ConfirmRow label={t('modal.c.name')} value={`${form.firstName} ${form.lastName}`} />
                  <ConfirmRow label={t('modal.c.email')} value={form.email} />
                  <ConfirmRow label={t('modal.c.prog')} value={selectedCerts.map(cert => cert.code).join(', ')} />
                  <ConfirmRow label={t('modal.c.seats')} value={`${effectiveSeats}`} />
                  <ConfirmRow label={t('modal.c.paid')} value={money(displayTotal)} />
                  <ConfirmRow label={t('modal.c.ref')} value={confirmed?.reference || 'Pending'} />
                </div>
                <div className="confirm-acts">
                  <button className="btn btn-em" onClick={handleClose}>{t('modal.return')}</button>
                  <button className="btn btn-ghost" onClick={printReceipt}>{t('modal.print')}</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {step < 4 && (
          <div className="modal-foot" id="modalFoot">
            <button className="modal-back" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
              <span data-t="modal.back">{t('modal.back')}</span>
            </button>
            <div className="modal-sec"><span aria-hidden="true">🔒</span><span data-t="modal.secure">{t('modal.secure')}</span>&ensp;<strong>{money(displayTotal)}</strong></div>
            <button className="modal-next" onClick={goNext} disabled={submitting}>
              <span data-t={`modal.next${step}`}>{submitting ? (t('modal.processing') || 'Processing…') : t(`modal.next${step}`)}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Field = ({ name, label, value, onChange, error, type = 'text', placeholder = '', autoComplete, required = true }) => (
  <div className="f-group">
    <label htmlFor={name}>{label} {required && <span className="req">*</span>}</label>
    <input id={name} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={!!error} />
    {error && <span className="f-error show" role="alert">{error}</span>}
  </div>
);

const SelectField = ({ name, label, value, onChange, options }) => (
  <div className="f-group">
    <label htmlFor={name}>{label}</label>
    <select id={name} name={name} value={value} onChange={onChange}>
      <option value="">Select…</option>
      {options.map(option => <option key={option} value={option}>{option}</option>)}
    </select>
  </div>
);

const SummaryRow = ({ label, value, highlight }) => (
  <div className="o-row">
    <span className="o-k" style={highlight ? { color: 'var(--em)' } : undefined}>{label}</span>
    <span className="o-v" style={highlight ? { color: 'var(--em)' } : undefined}>{Array.isArray(value) ? value.map(v => <div key={v}>{v}</div>) : value}</span>
  </div>
);

const ConfirmRow = ({ label, value }) => (
  <div className="c-row"><span className="c-k">{label}</span><span className="c-v">{value}</span></div>
);

EnrollmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  preselectedCodes: PropTypes.arrayOf(PropTypes.string),
  initialCohort: PropTypes.oneOf(['individual', 'team']),
};

Field.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};

SummaryRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  highlight: PropTypes.bool,
};

ConfirmRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default EnrollmentModal;
