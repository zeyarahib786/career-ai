'use strict';
const Certification = require('../models/Certification');
const AppError      = require('../utils/AppError');

const asPlain = value => (value && typeof value.toObject === 'function' ? value.toObject() : value);
const localised = (doc, locale) => asPlain(doc.localised(locale)) || {};
const serialiseCertification = (cert, locale, includeLocales = false) => ({
  code: cert.code,
  trackId: cert.trackId,
  displayLabel: cert.displayLabel,
  icon: cert.icon,
  priceUSD: cert.priceUSD,
  displayOrder: cert.displayOrder,
  ...(includeLocales ? { en: asPlain(cert.en), ar: asPlain(cert.ar), localised: localised(cert, locale) } : {}),
  ...localised(cert, locale),
});

const getAll = async (req, res, next) => {
  try {
    const locale = req.query.locale || 'en';
    const certs  = await Certification.findActive();
    res.json({ success:true, count:certs.length,
      data: certs.map(c => serialiseCertification(c, locale)) });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const cert = await Certification.findOne({ code:req.params.code, isActive:true });
    if (!cert) return next(new AppError('Certification not found', 404));
    const locale = req.query.locale || 'en';
    res.json({ success:true, data: serialiseCertification(cert, locale, true) });
  } catch (err) { next(err); }
};

const getByTrack = async (req, res, next) => {
  try {
    const locale = req.query.locale || 'en';
    const certs  = await Certification.findByTrack(req.params.id);
    res.json({ success:true, count:certs.length,
      data: certs.map(c => serialiseCertification(c, locale)) });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, getByTrack };
