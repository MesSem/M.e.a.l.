var cfg = require("./config.js");
var toJSON = require( 'utils-error-to-json' );

var errorCodes = this;

// esporto api_utilities così posso utilizzare i suoi metodi e attributi,
// come fosse una libreria
module.exports = errorCodes;


// =======================
// ERROR CODES
// =======================
this.ERR_API_NOT_FOUND = 'ERR_API_NOT_FOUND';
this.ERR_API_WRONG_PSW = 'ERR_API_WRONG_PSW';
this.ERR_API_UNAUTHORIZED= 'ERR_API_UNAUTHORIZED';
this.ERR_JWT_TOKEN_NOT_FOUND= 'ERR_JWT_TOKEN_NOT_FOUND';
this.ERR_TOKEN_EXPIRED= 'ERR_TOKEN_EXPIRED';
this.ERR_ELEMENT_NOT_FOUND='ERR_ELEMENT_NOT_FOUND';

/**
 * Function that send error infomation to client
 * @param  {[type]} res
 * @param  {[type]} cod      Code of the error, choose one from errorCodes.js
 * @param  {[type]} message  Message of the error
 * @param  {[type]} moreInfo More info of the error, only in developer mode. It can be everything. This method will convert it in json
 * @param  {[type]} status   Status of the error
 * @return {[type]}          res
 */
this.sendError= function(res,cod, message, moreInfo, status){
  if(status==undefined){
    status=500;
  }
  if(cfg.mode!='dev'){
    moreInfo=undefined;
  }else {
    errInfo=toJSON(moreInfo);
  }
  res.status(status).json({
    success: false,
    code:cod,
    message: message,
    error:errInfo
  });
}
