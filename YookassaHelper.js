const {v4} = require('uuid')
const axios = require('axios')

const createYookassaPayment = (sum, user_id) => {
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
            recipient: {gateway_id: '2032883'},
            confirmation: {type: 'redirect', return_url: 'https://t.me/ben_benis_bot'},
            metadata: {channel: 'telegram', user_id},
            capture: true,
            description: `Order for user_id: ${user_id}`
        }
    };

    return axios.request(options).then(function (response) {
        return response.data
    }).catch(function (error) {
        return error
    })
}

module.exports = {createYookassaPayment}