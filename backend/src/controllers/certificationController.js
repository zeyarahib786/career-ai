'use strict';
const Certification = require('../models/Certification');
const AppError      = require('../utils/AppError');

const getAll = async (req, res, next) => {
  try {
    const locale = req.query.locale || 'en';
    const certs  = await Certification.findActive();
    res.json({ success:true, count:certs.length,
      data: certs.map(c => ({ code:c.code, trackId:c.trackId, displayLabel:c.displayLabel,
        icon:c.icon, priceUSD:c.priceUSD, displayOrder:c.displayOrder, ...c.localised(locale) })) });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const cert = await Certification.findOne({ code:req.params.code, isActive:true });
    if (!cert) return next(new AppError('Certification not found', 404));
    const locale = req.query.locale || 'en';
    res.json({ success:true, data: { code:cert.code, trackId:cert.trackId,
      displayLabel:cert.displayLabel, icon:cert.icon, priceUSD:cert.priceUSD,
      displayOrder:cert.displayOrder, en:cert.en, ar:cert.ar, localised:cert.localised(locale) } });
  } catch (err) { next(err); }
};

const getByTrack = async (req, res, next) => {
  try {
    const locale = req.query.locale || 'en';
    const certs  = await Certification.findByTrack(req.params.id);
    res.json({ success:true, count:certs.length,
      data: certs.map(c => ({ code:c.code, displayLabel:c.displayLabel,
        icon:c.icon, priceUSD:c.priceUSD, ...c.localised(locale) })) });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne, getByTrack };
