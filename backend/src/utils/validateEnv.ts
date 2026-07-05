const REQUIRED_IN_PRODUCTION = ['MONGO_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'CLIENT_URL'];

export const validateEnv = (): void => {
  if (process.env.NODE_ENV !== 'production') return;

  const missing = REQUIRED_IN_PRODUCTION.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET === 'change_this_to_a_long_random_secret') {
    throw new Error('JWT_SECRET is still set to its placeholder value');
  }
};
