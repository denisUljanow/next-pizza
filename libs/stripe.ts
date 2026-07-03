import Stripe from 'stripe';

export const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  return new Stripe(apiKey, {
    typescript: true,
  });
};
