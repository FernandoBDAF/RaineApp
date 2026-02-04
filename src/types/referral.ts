export interface ReferralCode {
  code: string;
  validatedAt: string;
}

export interface ValidateReferralResult {
  valid: boolean;
  error?: string;
}
