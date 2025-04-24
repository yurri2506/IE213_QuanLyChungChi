const AuthRouter = require("./auth.route");
const IssuerRouter = require("./issuers.route");
const VerifierRouter = require("./verifiers.route");
const HolderRouter = require("./holders.route");
const ServiceRouter = require("./service.route");

const routes = (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/issuers", IssuerRouter);
  app.use("/api/verifiers", VerifierRouter);
  app.use("/api/holders", HolderRouter);
  app.use("/api/services", ServiceRouter);
};

module.exports = routes;
