const UserRouter = require('./user.route')

const routes = (app) => {
  app.use('/api/user', UserRouter);
}

module.exports = routes;