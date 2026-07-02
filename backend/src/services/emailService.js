'use strict';
const nodemailer = require('nodemailer');
const config     = require('../config/env');
const logger     = require('./logger');

let _t;
const getT = () => {
  if (!_t) _t = nodemailer.createTransport({
    host: config.email.host, port: config.email.port,
    secure: config.email.secure,
    auth: { user: config.email.user, pass: config.email.pass },
  });
  return _t;
};

const FROM = `"${config.email.fromName}" <${config.email.fromAddress}>`;

const confirmHTML = d => `<!DOCTYPE html>
<html lang="${d.locale || 'en'}"><head><meta charset="UTF-8"/><title>Enrollment Confirmed</title></head>
<body style="font-family:Inter,Arial,sans-serif;background:#030608;color:#ddeaff;margin:0;padding:0">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <p style="font-size:1.5rem;font-weight:800;color:#fff">Solvagence <span style="font-size:.75rem;color:#7890aa;letter-spacing:.15em;text-transform:uppercase">Global AI Academy</span></p>
  <div style="background:#00d68f;border-radius:4px;padding:24px;margin:20px 0">
    <h1 style="color:#030608;margin:0;font-size:1.5rem;font-weight:800">Enrollment Confirmed ✓</h1>
  </div>
  <p style="color:#96aac8;line-height:1.8">Dear ${d.name},</p>
  <p style="color:#96aac8;line-height:1.8">Your enrollment with Solvagence Global AI Academy is confirmed.</p>
  <div style="background:#07090f;border:1px solid rgba(255,255,255,.07);border-radius:4px;padding:20px;margin:20px 0">
    <table style="width:100%;border-collapse:collapse;font-size:.875rem">
      <tr><td style="color:#7890aa;padding:6px 0">Reference</td><td style="color:#00d68f;font-family:monospace;text-align:right">${d.reference}</td></tr>
      <tr><td style="color:#7890aa;padding:6px 0">Programme(s)</td><td style="color:#fff;text-align:right">${d.certs.join(', ')}</td></tr>
      <tr><td style="color:#7890aa;padding:6px 0">Seats</td><td style="color:#fff;text-align:right">${d.seats}</td></tr>
      <tr><td style="color:#7890aa;padding:6px 0;font-weight:700">Total</td><td style="color:#00d68f;font-weight:700;text-align:right">$${d.total} USD</td></tr>
    </table>
  </div>
  <p style="color:#96aac8;line-height:1.8">Pre-programme materials and calendar invite will follow. Questions? <a href="mailto:academy@solvagence.com" style="color:#00d68f">academy@solvagence.com</a></p>
  <p style="color:#566474;font-size:.75rem;margin-top:40px;border-top:1px solid rgba(255,255,255,.07);padding-top:16px">Solvagence Global AI Academy · DIFC, Dubai, UAE</p>
</div></body></html>`;

const adminHTML = d => `<h2>New Enrollment — ${d.reference}</h2>
<p><b>Name:</b> ${d.name}</p><p><b>Email:</b> ${d.email}</p>
<p><b>Organisation:</b> ${d.org || 'N/A'}</p><p><b>Country:</b> ${d.country || 'N/A'}</p>
<p><b>Programmes:</b> ${d.certs.join(', ')}</p>
<p><b>Seats:</b> ${d.seats}</p><p><b>Total:</b> $${d.total} USD</p>`;

const sendEnrollmentConfirmation = async (enrollment, participant, certNames) => {
  const d = {
    locale: enrollment.locale,
    name: `${participant.firstName} ${participant.lastName}`,
    reference: enrollment.reference,
    certs: certNames,
    seats: enrollment.seats,
    total: enrollment.pricing.totalUSD.toFixed(2),
    email: participant.email,
    org: participant.organisation,
    country: participant.country,
  };
  try {
    await getT().sendMail({ from:FROM, to:participant.email,
      subject:`Enrollment Confirmed — ${enrollment.reference} — Solvagence Global AI Academy`,
      html: confirmHTML(d) });
    await getT().sendMail({ from:FROM, to:config.email.academy,
      subject:`[New Enrollment] ${enrollment.reference} — ${d.name}`,
      html: adminHTML(d) });
    logger.info('Enrollment emails sent', { reference: enrollment.reference });
  } catch (err) {
    logger.error('Email failed', { error: err.message, reference: enrollment.reference });
  }
};

module.exports = { sendEnrollmentConfirmation };
