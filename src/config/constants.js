const CREDENTIAL_STATUS_TYPE = {
  SparseMerkleTreeProof: 'SparseMerkleTreeProof'
};

const PROOF_TYPE = {
  Iden3SparseMerkleTreeProof: 'Iden3SparseMerkleTreeProof'
};

const MERKLIZED_ROOT_POSITION = {
  NONE: 'none',
  INDEX: 'index',
  VALUE: 'value'
};

const ERROR_MESSAGES = {
  INVALID_SCHEMA: 'Invalid schema URL',
  INVALID_REQUEST: 'Invalid credential request',
  INVALID_ISSUER: 'Invalid issuer DID',
  CLAIM_NOT_FOUND: 'Claim not found',
  REVOCATION_ERROR: 'Error revoking credential',
  NETWORK_ERROR: 'Network connection error'
};

const DEFAULT_OPTIONS = {
  merklizedRootPosition: MERKLIZED_ROOT_POSITION.INDEX,
  version: 0,
  updatable: false
};

module.exports = {
  CREDENTIAL_STATUS_TYPE,
  PROOF_TYPE,
  MERKLIZED_ROOT_POSITION,
  ERROR_MESSAGES,
  DEFAULT_OPTIONS
};