// config/webpay.js
const { WebpayPlus } = require('transbank-sdk');

// Configuración para desarrollo (integración)
const WEBPAY_CONFIG = {
    // Para testing
    INTEGRATION: {
        commerceCode: '597055555532',
        apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        environment: 'integration'
    },

    // Para producción (completar con tus datos reales)
    // PRODUCTION: {
    //   commerceCode: process.env.WEBPAY_COMMERCE_CODE || 'TU_CODIGO_COMERCIO',
    // apiKey: process.env.WEBPAY_API_KEY || 'TU_API_KEY',
    //environment: 'production'
    //}
};

// Determinar el ambiente
const environment = 'INTEGRATION';
const config = WEBPAY_CONFIG[environment];

// Configurar WebPay Plus
WebpayPlus.configureForIntegration(config.commerceCode, config.apiKey);

// Si es producción, usar configuración de producción
//if (environment === 'PRODUCTION') {
//  WebpayPlus.configureForProduction(config.commerceCode, config.apiKey);
//}

module.exports = {
    WebpayPlus,
    config,
    environment
};