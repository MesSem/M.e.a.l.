// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Project = new Schema({
  owner:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name:{type:String, required:true},
  description:{type:String, required:true},
  image:{type:String, required:true},
  imagesGallery:[{type:String}],
  startDate: {type:Date, default:Date.now, required:true},
  endDate: {type:Date, min:Date.now, required:true},
  restitution: {
    date:{type:Date, max:Date.now, required:true},
    interests:Number
    },
  accepted: {type:Boolean, default:false},
  requestedMoney:{type:Number, required:true},
  actualMoney:{
    money:Number,
    cacheDate:Date
  }
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('projects', Project);
