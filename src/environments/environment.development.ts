export const environment = {
  production: false,
  identityApi: 'https://dev-identity.renamarkets.com/api/v1/',
  ecommerceApi:
    'https://rena-dev-ecommerce.agreeablewater-fe9b1d2c.northeurope.azurecontainerapps.io/api/v1/',
  storeApi: 'https://dev-ecommerce.renamarkets.com/api/',
  paystackPublicKey: 'pk_test_8e75de0f0e2bba17ee0b37ed227e176b92b52d0b',
  notificationApi: 'https://dev-notification.renamarkets.com/',
  googleClientId:
    '966209242791-ic7l4c7e00ltgb83hcnfe47fvrjfklbc.apps.googleusercontent.com',
  facebookAppId: '6053468244757747',
  cloudinaryName: 'dimxqjzpr',
  cloudinaryUploadPerset: 'unsigned1_openmarket',
  sellerStorefrontApi: 'https://dev-identity.renamarkets.com/api/v1/sellers/',
  walletApi: 'https://dev-wallet.renamarkets.com/api/v1/',
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
    'https://n8n-workflow.renamarkets.com/webhook/renamaket-contact-us',
  highlightInfo: {
    id: 'ng2orond',
    commmitVersion: 'abcdefg12345',
  },
  termsAndConditionsUrl:
    'https://doc.clickup.com/4543060/d/4amjm-2412/renamarkets-seller-contract',
  buyerTermsAndConditionsUrl:
    'https://doc.clickup.com/4543060/d/h/4amjm-2432/8fd9617c986a78c',
  kycVerificationWidgetId: {
    appId: '65baf87eb7c19d0040b25f68',
    key: 'prod_pk_SCP9XK8h3yHoSVYSIp40KGkhY',
    business: '65d76683f2409c004004739a',
    individual: '65d767faa264e90040fd63b4',
  },
  dataDog: {
    applicationId: '35fa418c-28ea-4625-8395-49e534fefebb',
    clientToken: 'pub21303a9a96fe4b820954d29340bea694',
  },
};
