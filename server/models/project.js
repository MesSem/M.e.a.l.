// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment=new Schema({
  _id: {type: Schema.Types.ObjectId, auto: true},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  text:{type:String, minlength: 3, required:true},
  date: {type:Date, default:Date.now, required:true}
});

var Project = new Schema({
  _id: {type: Schema.Types.ObjectId, auto: true},
  owner:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  name:{type:String, required:true},
  description:{type:String, required:true},
  image:{type:String, required:true},
  imagesGallery:[{type:String}],
  startDate: {type:Date, default:Date.now, required:true},
  endDate: {type:Date, min:Date.now, required:true},
  restitution: {
    date:{type:Date, min:Date.now, required:true},
    interests:{type:Number, required:true}
    },
  status: {
    value:{
      type:String,
      enum: ['TO_CHECK', 'NOT_ACCEPTED' ,'ACCEPTED', 'CLOSED', 'CLOSED_&_RESTITUTED', 'FORCED_CLOSING'],
      default:'TO_CHECK'
    },
    messageFromAdmin:{type: String}
  },
  requestedMoney:{type:Number, required:true},
  actualMoney:{
    money:Number,
    cacheDate:Date
  },
  isExample: {type:Boolean, default:false},
  comments: [Comment],
});

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('projects', Project);
