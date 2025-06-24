export default {
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  stripeSecret: process.env.STRIPE_SECRET_KEY || '',
  bcryptSaltRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
  tokenTypes: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    RESET: 'reset'
  }
};
