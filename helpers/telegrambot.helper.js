const axios = require('axios')
require('dotenv').config()

const telegramSendMessage = async (text, chat_id) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            text,
            chat_id
        }
    };

    try {
        return await axios.request(options)
    } catch (e) {
        console.log(e.data)
        return e
    }
}

const telegramEditMessage = async (text, chat_id, message_id) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            text,
            chat_id: Number(chat_id),
            message_id: Number(message_id) + 1
        }
    };

    try {
        return await axios.request(options)
    } catch (e) {
        console.log(e.data)
        return e
    }
}

const telegramAnswerPreCheckoutQuery = async (id) => {
    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerPreCheckoutQuery`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: {
            pre_checkout_query_id: id,
            ok: true
        }
    };

    try {
        return await axios.request(options)
    } catch (e) {
        console.log(e.data)
        return e
    }
}

const telegramSendInvoiceLink = async (amount, chat_id) => {
    const invoiceData = {
        title: "Title invoice #1",
        description: "Description #1",
        payload: "Payload #1",
        provider_token: process.env.TELEGRAM_PROVIDER_TOKEN,
        currency: "RUB",
        prices: JSON.stringify([{label: "Товарчик 1", amount: amount * 100}]),
        need_email: true,
        send_email_to_provider: true,
        provider_data: {
            "receipt": {
                "items": [{
                    "description": "Test item",
                    "vat_code": 3,
                    "quantity": 1,
                    "amount": {
                        "value": amount + '.00',
                        "currency": "RUB"
                    }
                }]
            }
        }
    }

    const options = {
        method: 'POST',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/createInvoiceLink`,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: invoiceData
    };

    let invoice
    try {
        invoice = await axios.request(options)
    } catch (e) {
        return e
    }

    if (invoice.data) {
        return await telegramSendMessage(`Your invoice: ${invoice.data.result}`, chat_id)
    }
}

const sendPaymentLink = async (url, user_id, sum) => {
    let data = JSON.stringify({
        "chat_id": user_id,
        "text": `К оплате: ${sum} рублей, для оплаты нажмите кнопку "Оплатить"!`,
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

    try {
        return await axios.request(config)
    } catch (e) {
        console.log(e.data)
        return e
    }
}

module.exports = {telegramAnswerPreCheckoutQuery, telegramSendMessage, telegramSendInvoiceLink, sendPaymentLink, telegramEditMessage}