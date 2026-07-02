'use strict';
const Track         = require('../models/Track');
const Certification = require('../models/Certification');
const AppError      = require('../utils/AppError');

const getAll = async (req, res, next) => {
  try {
    const locale = req.query.locale || 'en';
    const tracks = await Track.findActive();
    const data = await Promise.all(tracks.map(async t => {
      const certs = await Certification.findByTrack(t.trackId);
      return { trackId:t.trackId, displayOrder:t.displayOrder, accentColor:t.accentColor,
        icon:t.icon, localised:t.localised(locale),
        certifications: certs.map(c => ({ code:c.code, priceUSD:c.priceUSD, icon:c.icon,
          ...c.localised(locale) })) };
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
      accentColor:track.accentColor, icon:track.icon, en:track.en, ar:track.ar,
      localised:track.localised(locale),
      certifications: certs.map(c => ({ code:c.code, priceUSD:c.priceUSD,
        en:c.en, ar:c.ar, localised:c.localised(locale) })) } });
  } catch (err) { next(err); }
};

module.exports = { getAll, getOne };
