const axios = require('axios')
const qs = require('qs');

const templateTelegramRequest2 = async (endpoint, data) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${endpoint}`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: data
    };

    try {
        return await axios.request(options)
    } catch (e) {
        console.log(e.data)
        return e
    }
}

const templateTelegramRequest = async (endpoint, data) => {
    let result

    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/${endpoint}`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: data
    };

    axios.request(options).then(function (response) {
        result = response.data
    }).catch(function (error) {
        result = error.data
    });

    return await result
}

const telegramSendInvoiceLink2 = async () => {
    let data = qs.stringify({
        'title': 'title',
        'description': 'description',
        'payload': 'payload',
        'provider_token': '390540012:LIVE:29833',
        'currency': 'RUB',
        'prices': '[{"label": "Item #1", "amount": 10000}, {"label": "Item #2", "amount": 10000}]',
        'need_email': 'true',
        'send_email_to_provider': 'true',
        'provider_data': '{\n            "receipt": {\n                "items": [{\n                    "description": "Test item",\n                    "vat_code": 3,\n                    "quantity": 1,\n                    "amount": {\n                        "value": "100.00",\n                        "currency": "RUB"\n                    }\n                }, {\n                    "description": "Test item #2",\n                    "vat_code": 3,\n                    "quantity": 1,\n                    "amount": {\n                        "value": "100.00",\n                        "currency": "RUB"\n                    }\n                }]\n            }\n        }'
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.telegram.org/bot5789715696:AAEfRtRxkF2Yj6isg_pQzRRV5_Cx5BYMoYs/createInvoiceLink',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
    };

    try {
        const response = await axios.request(config)
        return response
    } catch (e) {
        console.log(e)
        return e
    }
    //
    // axios.request(config)
    //     .then((response) => {
    //         // console.log(JSON.stringify(response.data));
    //         result = response.data
    //     })
    //     .catch((error) => {
    //         // console.log(error);
    //         result = error
    //     });

}



const sendPaymentLink = (url) => {
    let result

    let data = JSON.stringify({
        "chat_id": "818727118",
        "text": "К оплате: 100 рублей, для оплаты нажмите кнопку \"Оплатить\"!",
        "reply_markup": {
            "inline_keyboard": [
                [
                    {
                        "text": "Оплатить!",
                        "callback_data": "\/return",
                        "url": url
                    }
                ]
            ]
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        headers: {
            'Content-Type': 'application/json'
        },
        data
    };

    axios.request(config).then(function (response) {
        result = response.data
    }).catch(function (error) {
        result = error
    });

    return result
}

const telegramAnswerPreCheckoutQuery = (id) => templateTelegramRequest2("answerPreCheckoutQuery", {"pre_checkout_query_id": id, "ok": "true"})
const telegramSendMessage = (text, chat_id) => templateTelegramRequest2("sendMessage", {chat_id, text})

const telegramSendInvoice = (chat_id, title, description, payload, price) => {
    const data = {
        chat_id,
        title,
        description,
        payload,
        provider_token: process.env.TELEGRAM_PROVIDER_TOKEN,
        currency: 'RUB',
        // need_email: true,
        // send_email_to_provider: true,
        // provider_data: JSON.stringify({
        //     receipt: {
        //         items: [{
        //             description: "item_1",
        //             quantity: "1.00",
        //             amount: {
        //                 value: "100.00",
        //                 currency: "RUB"
        //             },
        //             vat_code: 1
        //         }]
        //     }
        // }),
        prices: JSON.stringify([{label: price.label, amount: price.amount}])
    }
    return templateTelegramRequest("sendInvoice", data)
}
const telegramSendInvoiceLink = () => {
    const invoiceData = {
        title: "Title invoice",
        description: "Description",
        payload: "Payload #1",
        provider_token: process.env.TELEGRAM_PROVIDER_TOKEN,
        currency: "RUB",
        prices: JSON.stringify([{label: "Товарчик 1", amount: 10000}, {label: "Товарчик 2", amount: 10000}]),
        need_email: true,
        send_email_to_provider: true,
        provider_data: {
            "receipt": {
                "items": [{
                    "description": "Test item",
                    "vat_code": 3,
                    "quantity": 1,
                    "amount": {
                        "value": "100.00",
                        "currency": "RUB"
                    }
                }, {
                    "description": "Test item #2",
                    "vat_code": 3,
                    "quantity": 1,
                    "amount": {
                        "value": "100.00",
                        "currency": "RUB"
                    }
                }]
            }
        }
    }

    return templateTelegramRequest("createInvoiceLink", invoiceData)
}

module.exports = {templateTelegramRequest2, sendPaymentLink, telegramAnswerPreCheckoutQuery, telegramSendInvoice, telegramSendMessage, telegramSendInvoiceLink, telegramSendInvoiceLink2}