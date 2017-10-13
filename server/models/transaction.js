// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Transaction = new Schema({
  sender:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true},
  recipient:{type: mongoose.Schema.Types.ObjectId, ref: 'users', required:true}, //sempre richiesta. Nel caso di un prestito ci va l'id del server
  projectRecipient:{type: mongoose.Schema.Types.ObjectId, ref: 'projects'},
  money:{type:Number,required:true},
  date:{type:Date, default:Date.now,required:true},
  notes:String,
  type: {
      type:String,
      enum: ['LOAN', 'LOAN_RESTITUTION_FROM_OWNER' ,'LOAN_RESTITUTION_FROM_SERVER', 'MOVEMENT_TO_OWNER', ''],
      default:''//INDICA UNA TRANSAZIONE CLASSICA
    }
});

////GUIDA oggetto type:
////''-->transazione CLASSICA
////'LOAN'-->Prestito dall'utente a un progetto
////'LOAN_RESTITUTION_FROM_OWNER'-->Restituzione prestito dal proprietario
////'LOAN_RESTITUTION_FROM_SERVER'-->Restituzione soldi dal server nel caso si chiuda il prestito prematuramente
////'MOVEMENT_TO_OWNER'-->Invio dei soldi da parte del server al creatore del progetto per il suo completamento
////

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('transactions', Transaction);
