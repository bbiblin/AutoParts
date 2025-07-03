const { WebpayPlus } = require('transbank-sdk');
require("dotenv").config();

const WEBPAY_CONFIG = {
    INTEGRATION: {
        commerceCode: process.env.COMMERCE_CODE,
        apiKey: process.env.API_KEY,
        environment: process.env.ENVIROMENT
    },
};


const environment = 'INTEGRATION';
const config = WEBPAY_CONFIG[environment];


WebpayPlus.configureForIntegration(config.commerceCode, config.apiKey);


module.exports = {
    WebpayPlus,
    config,
    environment
};