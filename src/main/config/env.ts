export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/clean-node-api',
  port: process.env.PORT || 3030,
  jwtSecret: process.env.JWT_SECRET || 'awijdaiowj12312@#@#!@#doiajwsdaj===-a0'
}
