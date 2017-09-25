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
