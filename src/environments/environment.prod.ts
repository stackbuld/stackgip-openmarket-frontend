export const environment = {
  production: true,
  identityApi:  process.env.identityApi?? 'https://api-identity.renamarkets.com/api/v1/',
  ecommerceApi: process.env.ecommerceApi?? 'https://api-ecommerce.renamarkets.com/api/v1/',
  storeApi: process.env.storeApi?? 'https://api-ecommerce.renamarkets.com/api/',
  paystackPublicKey: process.env.paystackPublicKey ?? 'pk_test_8e75de0f0e2bba17ee0b37ed227e176b92b52d0b',
  notificationApi: process.env.notificationApi ?? 'https://api-notification.renamarkets.com/',
  googleClientId: process.env.googleClientId?? '966209242791-ic7l4c7e00ltgb83hcnfe47fvrjfklbc.apps.googleusercontent.com',
  facebookAppId: process.env.facebookAppId?? '6053468244757747',
  cloudinaryName: process.env.cloudinaryName ?? 'dimxqjzpr',
  cloudinaryUploadPerset: process.env.cloudinaryUploadPerset?? 'unsigned1_openmarket',
  sellerStorefrontApi: process.env.sellerStorefrontApi?? 'https://api-identity.renamarkets.com/api/v1/sellers/',
  walletApi: process.env.walletApi?? 'https://api-wallet.renamarkets.com/api/v1/',
  algolia: {
    appId: process.env.algolia__appId?? 'FFW9XSFVBK',
    apiKey: process.env.algolia__apiKey?? '8e009ce54b2cb72e747aad9fb4ca822c',
    indexName: {
      products: process.env.algolia__indexName__products??'products_index',
      categories: process.env.algolia__indexName__categories??'categories_index',
      promotedProducts: process.env.algolia__indexName__promotedProducts?? 'promoted_products_index_1',
      recommendedProducts: process.env.algolia__indexName__recommendedProducts??  'recomended_products_index_1',
    },
    // urlSync: false
  },
};
