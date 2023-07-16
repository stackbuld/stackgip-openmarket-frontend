// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  identityApi: 'https://dev-identity.renamarkets.com/api/v1/',
  // identityApi: 'http://localhost:59906/api/v1/',
  ecommerceApi: 'https://dev-ecommerce.renamarkets.com/api/v1/',
  // ecommerceApi: 'https://localhost:57800/api/v1/',

  storeApi: 'https://dev-ecommerce.renamarkets.com/api/',
  walletApi:
    'https://dev-wallet-container-app.agreeablewater-fe9b1d2c.northeurope.azurecontainerapps.io/',
  // ecommerceApi: "http://localhost:57889/api/v1/",
  paystackPublicKey: 'pk_test_8e75de0f0e2bba17ee0b37ed227e176b92b52d0b',
  googleClientId:
    '966209242791-ic7l4c7e00ltgb83hcnfe47fvrjfklbc.apps.googleusercontent.com',
  facebookAppId: '6053468244757747',
  cloudinaryName: 'dimxqjzpr',
  cloudinaryUploadPerset: 'unsigned1_openmarket',

  algolia: {
    appId: 'FFW9XSFVBK',
    apiKey: '8e009ce54b2cb72e747aad9fb4ca822c',
    indexName: 'products_index',
    // urlSync: false
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
