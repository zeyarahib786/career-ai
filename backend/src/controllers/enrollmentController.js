'use strict';
const Certification = require('../models/Certification');
const { Enrollment, Participant } = require('../models/Enrollment');
const pricingService = require('../services/pricingService');
const emailService   = require('../services/emailService');
const AppError       = require('../utils/AppError');
const logger         = require('../services/logger');

const create = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, country, jobTitle, organisation,
            industry, yearsExperience, qualification, linkedInUrl, howHeard,
            learningGoals, certificationCodes, cohortType, seats, locale,
            dataConsent, marketingConsent, paymentMethod } = req.body;

    const certs = await Certification.find({ code:{ $in:certificationCodes }, isActive:true });
    if (certs.length !== certificationCodes.length)
      return next(new AppError('One or more certification codes are invalid', 400));

    const seatCount = parseInt(seats, 10) || 1;
    const pricing   = pricingService.calculateFromDocs(certs, seatCount, cohortType, country);

    if (pricing.isCustom) return res.status(202).json({
      success:true,
      message:'Your group size qualifies for enterprise pricing. Our team will contact you within 1 business day.',
      contact:'leaders@solvagence.com',
    });

    const participant = await Participant.create({
      firstName, lastName, email, phone, country, jobTitle, organisation,
      industry, yearsExperience, qualification, linkedInUrl, howHeard, learningGoals,
      dataConsent: dataConsent === 'true', marketingConsent: marketingConsent === 'true',
    });

    const enrollment = await Enrollment.create({
      participant:        participant._id,
      certificationCodes,
      cohortType,
      seats:              seatCount,
      pricing: {
        subtotalUSD:      pricing.subtotalUSD,
        bundleDiscount:   pricing.bundleRate,
        teamDiscount:     pricing.teamRate,
        discountUSD:      pricing.discountUSD,
        afterDiscountUSD: pricing.afterDiscountUSD,
        vatRate:          pricing.vatRate,
        vatUSD:           pricing.vatAmountUSD,
        totalUSD:         pricing.totalUSD,
        currency:         pricing.currency,
      },
      status:             paymentMethod ? 'confirmed' : 'pending',
      paymentMethod:      paymentMethod || null,
      locale:             locale || 'en',
      confirmedAt:        paymentMethod ? new Date() : null,
    });

    const certNames = certs.map(c => locale === 'ar' ? c.ar.title : c.en.title);
    emailService.sendEnrollmentConfirmation(enrollment, participant, certNames);
    logger.info('Enrollment created', { reference:enrollment.reference, email, total:pricing.totalUSD });

    res.status(201).json({ success:true, data: {
      reference:     enrollment.reference,
      status:        enrollment.status,
      pricing,
      certifications:certNames,
      confirmedAt:   enrollment.confirmedAt,
    }});
  } catch (err) { next(err); }
};

const getByReference = async (req, res, next) => {
  try {
    const e = await Enrollment.findOne({ reference:req.params.reference })
      .populate('participant','firstName lastName email organisation country');
    if (!e) return next(new AppError('Enrollment not found', 404));
    res.json({ success:true, data: {
      reference:          e.reference,
      status:             e.status,
      certificationCodes: e.certificationCodes,
      seats:              e.seats,
      pricing:            e.pricing,
      participant: {
        name:         e.participant.fullName,
        email:        e.participant.email,
        organisation: e.participant.organisation,
        country:      e.participant.country,
      },
      createdAt:   e.createdAt,
      confirmedAt: e.confirmedAt,
    }});
  } catch (err) { next(err); }
};

module.exports = { create, getByReference };
