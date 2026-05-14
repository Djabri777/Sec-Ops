const BASE = 'https://pay.chargily.net/test/api/v2';
const SECRET = import.meta.env.VITE_CHARGILY_SECRET;

const PLANS = {
  starter:    { label: 'Starter',    amount: 45000  },
  growth:     { label: 'Growth',     amount: 120000 },
  enterprise: { label: 'Enterprise', amount: 400000 },
};

export const createCheckout = async ({ plan, userId, locale = 'en' }) => {
  const { amount } = PLANS[plan];

  const successUrl = `${window.location.origin}${window.location.pathname}#/payment-success?plan=${plan}&uid=${userId}`;
  const failureUrl = `${window.location.origin}${window.location.pathname}#/payment-failed`;

  const res = await fetch(`${BASE}/checkouts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency: 'dzd',
      success_url: successUrl,
      failure_url: failureUrl,
      locale,
      metadata: { plan, userId },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  const data = await res.json();
  return data.checkout_url;
};

export { PLANS };
