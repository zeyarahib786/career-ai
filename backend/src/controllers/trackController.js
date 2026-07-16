'use strict';
const Track         = require('../models/Track');
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
    const tracks = await Track.findActive();
    const data = await Promise.all(tracks.map(async t => {
      const certs = await Certification.findByTrack(t.trackId);
      return { trackId:t.trackId, displayOrder:t.displayOrder, accentColor:t.accentColor,
        icon:t.icon, localised:localised(t, locale),
        certifications: certs.map(c => serialiseCertification(c, locale)) };
    }));
    res.json({ success:true, count:data.length, data });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const track = await Track.findOne({ trackId:req.params.id, isActive:true });
    if (!track) return next(new AppError('Track not found', 404));
    const locale = req.query.locale || 'en';
    const certs  = await Certification.findByTrack(req.params.id);
    res.json({ success:true, data: { trackId:track.trackId, displayOrder:track.displayOrder,
      accentColor:track.accentColor, icon:track.icon, en:asPlain(track.en), ar:asPlain(track.ar),
      localised:localised(track, locale),
      certifications: certs.map(c => serialiseCertification(c, locale, true)) } });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne };
