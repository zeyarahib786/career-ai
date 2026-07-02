'use strict';
const { Schema, model } = require('mongoose');
const { collections } = require('../config/collections');

// Participant — stored separately per UAE PDPL / DIFC DPL data governance
const ParticipantSchema = new Schema({
  firstName:        { type:String, required:true, trim:true },
  lastName:         { type:String, required:true, trim:true },
  email:            { type:String, required:true, lowercase:true, trim:true, index:true },
  phone:            String,
  country:          String,
  jobTitle:         String,
  organisation:     String,
  industry:         String,
  yearsExperience:  String,
  qualification:    String,
  linkedInUrl:      String,
  howHeard:         String,
  learningGoals:    String,
  dataConsent:      { type:Boolean, required:true, default:false },
  marketingConsent: { type:Boolean, default:false },
  consentDate:      { type:Date, default:Date.now },
  retainUntil:      Date,   // 7-year retention per UAE commercial law
}, { timestamps:true });

ParticipantSchema.pre('save', function(next) {
  if (!this.retainUntil) {
    const d = new Date(); d.setFullYear(d.getFullYear() + 7);
    this.retainUntil = d;
  }
  next();
});

ParticipantSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const PricingSnapshot = new Schema({
  subtotalUSD:      Number, bundleDiscount:Number, teamDiscount:Number,
  discountUSD:      Number, afterDiscountUSD:Number,
  vatRate:          Number, vatUSD:Number, totalUSD:Number,
  currency:         { type:String, default:'USD' },
}, { _id:false });

const EnrollmentSchema = new Schema({
  reference:          { type:String, unique:true, index:true },
  participant:        { type:Schema.Types.ObjectId, ref:'Participant', required:true },
  certificationCodes: [{ type:String, match:/^SGA-0[1-6]$/ }],
  cohortType:         { type:String, enum:['individual','team'], default:'individual' },
  seats:              { type:Number, default:1, min:1 },
  pricing:            { type:PricingSnapshot, required:true },
  status:             { type:String, enum:['pending','confirmed','cancelled','refunded'], default:'pending', index:true },
  paymentMethod:      { type:String, enum:['card','invoice','lpo','stripe',null], default:null },
  stripePaymentIntentId: String,
  locale:             { type:String, enum:['en','ar'], default:'en' },
  confirmedAt:        Date,
  cancelledAt:        Date,
}, { timestamps:true, toJSON:{ virtuals:true } });

EnrollmentSchema.pre('save', function(next) {
  if (!this.reference) {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2,5).toUpperCase();
    this.reference = `SGA-${ts}${rand}`;
  }
  next();
});

const Participant = model('Participant', ParticipantSchema, collections.participants);
const Enrollment  = model('Enrollment', EnrollmentSchema, collections.enrollments);

module.exports = { Enrollment, Participant };
