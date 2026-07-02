'use strict';
const { Schema, model } = require('mongoose');
const { collections } = require('../config/collections');

const TLocale = new Schema({
  badge:String, name:String, description:String, cta:{ type:String, default:'Explore Track' }
}, { _id:false });

const TrackSchema = new Schema({
  trackId:            { type:String, required:true, unique:true, enum:['t1','t2','t3','t4'], index:true },
  displayOrder:       { type:Number, required:true },
  accentColor:        { type:String, default:'#00d68f' },
  icon:               String,
  certificationCodes: [{ type:String, match:/^SGA-0[1-6]$/ }],
  isActive:           { type:Boolean, default:true },
  en:                 { type:TLocale, required:true },
  ar:                 { type:TLocale, required:true },
}, { timestamps:true });

TrackSchema.methods.localised  = function(l='en') { return l==='ar' ? this.ar : this.en; };
TrackSchema.statics.findActive = function()       { return this.find({ isActive:true }).sort({ displayOrder:1 }); };

module.exports = model('Track', TrackSchema, collections.tracks);
