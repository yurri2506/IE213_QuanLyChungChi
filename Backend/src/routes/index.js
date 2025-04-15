const AuthRouter = require('./auth.route')
const IssuerRouter = require('./issuers.route')
const VerifierRouter = require('./verifiers.route')
const HolderRouter = require('./holders.route')

const routes = (app) => {
  app.use('/api/auth', AuthRouter);
  app.use('/api/issuers', IssuerRouter);
  app.use('/api/verifiers', VerifierRouter);  
  app.use('/api/holders', HolderRouter);
}

module.exports = routes;