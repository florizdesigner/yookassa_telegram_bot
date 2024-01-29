const {v4} = require('uuid')
const axios = require('axios')

const createYookassaPayment = (sum, user_id, message_id) => {
    const options = {
        method: 'POST',
        url: 'https://api.yookassa.ru/v3/payments',
        headers: {
            'Content-Type': 'application/json',
            'Idempotence-Key': v4(),
            Authorization: `Basic ${Buffer.from(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString('base64')}`
        },
        data: {
            amount: {value: sum, currency: 'RUB'},
            recipient: {gateway_id: process.env.YOOKASSA_GATEWAY_ID || null},
            confirmation: {type: 'redirect', return_url: process.env.TELEGRAM_BOT_LINK},
            metadata: {channel: 'telegram', user_id, message_id},
            capture: true,
            description: `Order for user_id: ${user_id}`
        }
    };

    axios.request(options).then(function (response) {
        return response.data
    }).catch(function (error) {
        return error
    })
}

module.exports = {createYookassaPayment}