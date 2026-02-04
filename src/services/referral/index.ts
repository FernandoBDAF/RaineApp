import type { ValidateReferralResult } from '../../types';

export async function validateReferralCode(code: string): Promise<ValidateReferralResult> {
  const isValidFormat = /^[A-Za-z0-9]{7}$/.test(code);

  if (!isValidFormat) {
    return { valid: false, error: 'Invalid code. Please try again' };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return { valid: true };
}

export async function consumeReferralCode(code: string, userId: string): Promise<void> {
  console.log(`Code ${code} consumed by user ${userId}`);
}
