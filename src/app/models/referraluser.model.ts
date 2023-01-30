export interface ReferralUser {
  id: string;
  email: string;
  shares: number;
  referrals: number;
  referral_code: string;
  referral_link: string;
  referral_status_link: string;
  list_position: number;
  list_ahead: number;
  list_behind: number;
  list_length: number;
  created_at: Date;
  updated_at: Date;
  profile: ReferralUserProfle;
}

export interface ReferralUserProfle {
  first_name: string;
  last_name: string;
  browser_name: string;
  browser_version: string;
  os_name: string;
  os_version: string;
  ip: string;
  http_referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: null;
  utm_term: null;
  utm_content: null;
}
