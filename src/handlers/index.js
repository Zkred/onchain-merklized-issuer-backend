class Handlers {
  constructor(
    systemHandler,
    authenticationHandler,
    iden3commHandler,
    issuerHandler
  ) {
    this.systemHandler = systemHandler;
    this.authenticationHandler = authenticationHandler;
    this.iden3commHandler = iden3commHandler;
    this.issuerHandler = issuerHandler;
  }
}

module.exports = Handlers;