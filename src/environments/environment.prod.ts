export const environment = {
  production: true,
  identityApi: 'https://api-identity.renamarkets.com/api/v1/',
  ecommerceApi: 'https://api-ecommerce.renamarkets.com/api/v1/',
  storeApi: 'https://api-ecommerce.renamarkets.com/api/',
  paystackPublicKey: 'pk_test_8e75de0f0e2bba17ee0b37ed227e176b92b52d0b',
  notificationApi: 'https://api-notification.renamarkets.com/',
  googleClientId:
    '966209242791-ic7l4c7e00ltgb83hcnfe47fvrjfklbc.apps.googleusercontent.com',
  facebookAppId: '6053468244757747',
  cloudinaryName: 'dimxqjzpr',
  cloudinaryUploadPerset: 'unsigned1_openmarket',
  sellerStorefrontApi: 'https://api-identity.renamarkets.com/api/v1/sellers/',
  walletApi: 'https://api-wallet.renamarkets.com/api/v1/',
  algolia: {
    appId: 'FFW9XSFVBK',
    apiKey: '8e009ce54b2cb72e747aad9fb4ca822c',
    indexName: {
      products: 'products_index',
      categories: 'categories_index',
      promotedProducts: 'promoted_products_index_1',
      recommendedProducts: 'recomended_products_index_1',
    },
    // urlSync: false
  },
  contactUsWebhook:
    'https://n8n-workflow.renamarkets.com/webhook/prod/renamaket-contact-us'
  ,
  highlightInfo: {
    id: 'ng2orond',
    commmitVersion: 'abcdefg12345'
  }
};
