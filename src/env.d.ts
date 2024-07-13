interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  /**
   * Built-in environment variable.
   * @see Docs https://github.com/chihab/dotenv-run/packages/angular#node_env.
   */
  readonly NODE_ENV: string;
  // Add your environment variables below
  // readonly NG_APP_API_URL: string;
  [key: string]: any;
  NG_APP_PRODUCTION: boolean;
  NG_APP_IDENTITY_API: string;
  NG_APP_ECOMMERCE_API: string;
  NG_APP_STORE_API: string;
  NG_APP_PAYSTACK_PUBLIC_KEY: string;
  NG_APP_NOTIFICATION_API: string;
  NG_APP_GOOGLE_CLIENT_ID: string;
  NG_APP_FACEBOOK_APP_ID: string;
  NG_APP_CLOUDINARY_NAME: string;
  NG_APP_CLOUDINARY_UPLOAD_PRESET: string;
  NG_APP_SELLER_STOREFRONT_API: string;
  NG_APP_WALLET_API: string;
  NG_APP_COOKIE_DOMAIN: string;
  NG_APP_SEO_DOMAIN: string;
  NG_APP_MS_CLARITY_PROJECT_ID: string;
  NG_APP_ALGOLIA_APPID: string;
  NG_APP_ALGOLIA_APIKEY: string;
  NG_APP_ALGOLIA_INDEXNAME_PRODUCTS: string;
  NG_APP_ALGOLIA_INDEXNAME_CATEGORIES: string;
  NG_APP_ALGOLIA_INDEXNAME_PROMOTED_PRODUCTS: string;
  NG_APP_ALGOLIA_INDEXNAME_RECOMMENDED_PRODUCTS: string;
  NG_APP_CONTACT_US_WEBHOOK: string;
  NG_APP_HIGHLIGHT_INFO_ID: string;
  NG_APP_HIGHLIGHT_INFO_COMMIT_VERSION: string;
  NG_APP_TERMS_AND_CONDITIONS_URL: string;
  NG_APP_BUYER_TERMS_AND_CONDITIONS_URL: string;
  NG_APP_KYC_VERIFICATION_WIDGETID_APPID: string;
  NG_APP_KYC_VERIFICATION_WIDGETID_KEY: string;
  NG_APP_KYC_VERIFICATION_WIDGETID_BUSINESS: string;
  NG_APP_KYC_VERIFICATION_WIDGETID_INDIVIDUAL: string;
  NG_APP_DATADOG_APPLICATION_ID: string;
  NG_APP_DATADOG_CLIENT_TOKEN: string;
}

/*
 * Remove all the deprecated code below if you're using import.meta.env (recommended)
 */

/****************************** DEPREACTED **************************/
/**
 * @deprecated process.env usage
 * prefer using import.meta.env
 * */
// declare var process: {
//   env: {
//     NODE_ENV: string;
//     [key: string]: any;
//   };
// };

// If your project references @types/node directly (in you) or indirectly (as in RxJS < 7.6.0),
// you might need to use the following declaration merging.
// declare namespace NodeJS {
//   export interface ProcessEnv {
//     readonly NODE_ENV: string;
//     // Add your environment variables below
//   }
// }

// If you're using Angular Universal and process.env notation, you'll need to add the following to your tsconfig.server.json:
/* In your tsconfig.server.json */
// {
//   "extends": "./tsconfig.app.json",
//   ...
//   "exclude": [
//     "src/env.d.ts"
//   ]
// }

/*********************************************************************/
