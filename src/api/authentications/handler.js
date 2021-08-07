class AuthenticationsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator
  }

  async postAuthenticationHandler (request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload)

    const { username, password } = request.payload
  }
}
