export const environment = {
  production: import.meta.env.NG_APP_PRODUCTION,
  identityApi: import.meta.env.NG_APP_IDENTITY_API,
  ecommerceApi: import.meta.env.NG_APP_ECOMMERCE_API,
  storeApi: import.meta.env.NG_APP_STORE_API,
  paystackPublicKey: import.meta.env.NG_APP_PAYSTACK_PUBLIC_KEY,
  notificationApi: import.meta.env.NG_APP_NOTIFICATION_API,
  googleClientId: import.meta.env.NG_APP_GOOGLE_CLIENT_ID,
  facebookAppId: import.meta.env.NG_APP_FACEBOOK_APP_ID,
  cloudinaryName: import.meta.env.NG_APP_CLOUDINARY_NAME,
  cloudinaryUploadPerset: import.meta.env.NG_APP_CLOUDINARY_UPLOAD_PRESET,
  sellerStorefrontApi: import.meta.env.NG_APP_SELLER_STOREFRONT_API,
  walletApi: import.meta.env.NG_APP_WALLET_API,
  cookieDomain: import.meta.env.NG_APP_COOKIE_DOMAIN, // should be .renamarkets.com on production and for .staging.renamarkets.com
  seoDomain: import.meta.env.NG_APP_SEO_DOMAIN,
  msClarityProjectId: import.meta.env.NG_APP_MS_CLARITY_PROJECT_ID,
  algolia: {
    appId: import.meta.env.NG_APP_ALGOLIA_APPID,
    apiKey: import.meta.env.NG_APP_ALGOLIA_APIKEY,
    indexName: {
      products: import.meta.env.NG_APP_ALGOLIA_INDEXNAME_PRODUCTS,
      categories: import.meta.env.NG_APP_ALGOLIA_INDEXNAME_CATEGORIES,
      promotedProducts: import.meta.env.NG_APP_ALGOLIA_INDEXNAME_PROMOTED_PRODUCTS,
      recommendedProducts: import.meta.env.NG_APP_ALGOLIA_INDEXNAME_RECOMMENDED_PRODUCTS,
    },
  },
  contactUsWebhook: import.meta.env.NG_APP_CONTACT_US_WEBHOOK,
  highlightInfo: {
    id: import.meta.env.NG_APP_HIGHLIGHT_INFO_ID,
    commmitVersion: import.meta.env.NG_APP_HIGHLIGHT_INFO_COMMIT_VERSION,
  },
  termsAndConditionsUrl: import.meta.env.NG_APP_TERMS_AND_CONDITIONS_URL,
  buyerTermsAndConditionsUrl: import.meta.env.NG_APP_BUYER_TERMS_AND_CONDITIONS_URL,
  kycVerificationWidgetId: {
    appId: import.meta.env.NG_APP_KYC_VERIFICATION_WIDGETID_APPID,
    key: import.meta.env.NG_APP_KYC_VERIFICATION_WIDGETID_KEY,
    business: import.meta.env.NG_APP_KYC_VERIFICATION_WIDGETID_BUSINESS,
    individual: import.meta.env.NG_APP_KYC_VERIFICATION_WIDGETID_INDIVIDUAL,
  },
  dataDog: {
    applicationId: import.meta.env.NG_APP_DATADOG_APPLICATION_ID,
    clientToken: import.meta.env.NG_APP_DATADOG_CLIENT_TOKEN,
  },
};
