FROM node:latest as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build:ssr


# Stage 2: Set up the server

FROM node:latest as serve

WORKDIR /app

COPY --from=build /app/dist ./dist


EXPOSE 4000
ENV NG_APP_PRODUCTION "true"
ENV NG_APP_IDENTITY_API "https://api-identity.renamarkets.com/api/v1/"
ENV NG_APP_ECOMMERCE_API "https://api-ecommerce.renamarkets.com/api/v1/"
ENV NG_APP_STORE_API "https://api-ecommerce.renamarkets.com/api/"
ENV NG_APP_PAYSTACK_PUBLIC_KEY ""
ENV NG_APP_NOTIFICATION_API "https://api-notification.renamarkets.com/"
ENV NG_APP_GOOGLE_CLIENT_ID "966209242791-ic7l4c7e00ltgb83hcnfe47fvrjfklbc.apps.googleusercontent.com"
ENV NG_APP_FACEBOOK_APP_ID "6053468244757747"
ENV NG_APP_CLOUDINARY_NAME "dimxqjzpr"
ENV NG_APP_CLOUDINARY_UPLOAD_PRESET "unsigned1_openmarket"
ENV NG_APP_SELLER_STOREFRONT_API "https://api-identity.renamarkets.com/api/v1/sellers/"
ENV NG_APP_WALLET_API "https://api-wallet.renamarkets.com/api/v1/"
ENV NG_APP_COOKIE_DOMAIN ".renamarkets.com"
ENV NG_APP_SEO_DOMAIN "https://renamarkets.com"
ENV NG_APP_MS_CLARITY_PROJECT_ID "n5lxnxt0d0"
ENV NG_APP_ALGOLIA_APPID "3FEM6PO229"
ENV NG_APP_ALGOLIA_APIKEY "1d3b29cfc6e95e3fbb2c76d05025d8f5"
ENV NG_APP_ALGOLIA_INDEXNAME_PRODUCTS "products_index"
ENV NG_APP_ALGOLIA_INDEXNAME_CATEGORIES "categories_index"
ENV NG_APP_ALGOLIA_INDEXNAME_PROMOTED_PRODUCTS "promoted_products_index"
ENV NG_APP_ALGOLIA_INDEXNAME_RECOMMENDED_PRODUCTS "recomended_products_index"
ENV NG_APP_CONTACT_US_WEBHOOK "https://n8n-workflow.renamarkets.com/webhook/prod/renamaket-contact-us"
ENV NG_APP_HIGHLIGHT_INFO_ID "5g5x48ld"
ENV NG_APP_HIGHLIGHT_INFO_COMMIT_VERSION "abcdefg12345"
ENV NG_APP_TERMS_AND_CONDITIONS_URL "https://doc.clickup.com/4543060/d/4amjm-2412/renamarkets-seller-contract"
ENV NG_APP_BUYER_TERMS_AND_CONDITIONS_URL "https://doc.clickup.com/4543060/d/h/4amjm-2432/8fd9617c986a78c"
ENV NG_APP_KYC_VERIFICATION_WIDGETID_APPID "65baf87eb7c19d0040b25f68"
ENV NG_APP_KYC_VERIFICATION_WIDGETID_KEY "prod_pk_SCP9XK8h3yHoSVYSIp40KGkhY"
ENV NG_APP_KYC_VERIFICATION_WIDGETID_BUSINESS "65bb6ea17063700040c23802"
ENV NG_APP_KYC_VERIFICATION_WIDGETID_INDIVIDUAL "65baf9e6cd21f60040595585"
ENV NG_APP_DATADOG_APPLICATION_ID "35fa418c-28ea-4625-8395-49e534fefebb"
ENV NG_APP_DATADOG_CLIENT_TOKEN "pub21303a9a96fe4b820954d29340bea694"

CMD [ "node", "dist/stackbuld-ecommerce/server/main.js" ]

