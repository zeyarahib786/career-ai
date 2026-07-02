'use strict';
const { Schema, model } = require('mongoose');
const { collections } = require('../config/collections');

const LocaleContent = new Schema({
  title:     { type:String, required:true },
  tagline:   String,
  summary:   String,
  whyChoose: String,
  whatGain:  String,
  modules:  [{ code:String, title:String }],
  chips:    [String],
}, { _id:false });

const CertSchema = new Schema({
  code:         { type:String, required:true, unique:true, match:/^SGA-0[1-6]$/, index:true },
  trackId:      { type:String, required:true, enum:['t1','t2','t3','t4'], index:true },
  displayLabel: { type:String, required:true },
  icon:         { type:String, default:'◆' },
  priceUSD:     { type:Number, required:true, min:0 },
  displayOrder: { type:Number, required:true },
  isActive:     { type:Boolean, default:true, index:true },
  en:           { type:LocaleContent, required:true },
  ar:           { type:LocaleContent, required:true },
}, { timestamps:true, toJSON:{ virtuals:true } });

CertSchema.methods.localised   = function(l='en') { return l==='ar' ? this.ar : this.en; };
CertSchema.statics.findActive  = function()       { return this.find({ isActive:true }).sort({ displayOrder:1 }); };
CertSchema.statics.findByTrack = function(tid)    { return this.find({ trackId:tid, isActive:true }).sort({ displayOrder:1 }); };

module.exports = model('Certification', CertSchema, collections.certifications);
