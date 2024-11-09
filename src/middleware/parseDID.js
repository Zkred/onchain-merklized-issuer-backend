const { InvalidDIDError } = require('../utils/errors');

const parseDID = (req, res, next) => {
  const { identifier } = req.params;
  
  if (!identifier || !identifier.startsWith('did:iden3:')) {
    return next(new InvalidDIDError('Invalid DID format'));
  }

  req.did = identifier;
  next();
};

module.exports = {parseDID};