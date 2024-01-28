const axios = require('axios')
const express = require('express')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3001

const answerPreCheckoutQuery = async (id) => {
    let config = {
        method: 'post',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerPreCheckoutQuery?ok=true&pre_checkout_query_id=${id}`,
        headers: { }
    };

    try {
        return await axios.request(config)
    } catch (e) {
        return e
    }
}

const sendMessage = async (text, chat_id) => {
    let config = {
        method: 'post',
        url: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?text=${text}&chat_id=${chat_id}`,
        headers: { }
    };

    try {
        return await axios.request(config)
    } catch (e) {
        return e
    }
}

const createInvoiceLink = async (amount, chat_id) => {
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

    console.log(invoice)

    if (invoice.data) {
        return await sendMessage(`Your invoice: ${invoice.data.result}`, chat_id)
    }
}

app.post('/telegram', async (req, res) => {
    console.log(req.body)

    try {
        if (Object.keys(req.body).length > 0) {

            if (req.body.message.text === "/invoice") {
                console.log("первое условие")
                await createInvoiceLink(100, req.body.message.chat.id)
                res.status(200)
            } else if (req.body.pre_checkout_query) {
                console.log("второе условие")
                await answerPreCheckoutQuery(req.body.pre_checkout_query.id)
                res.status(200)
            } else if (req.body.message.successful_payment) {
                console.log("третье условие")
                await sendMessage(`Thanks, payment successful! Payment ID: ${req.body.message.successful_payment.provider_payment_charge_id}`, req.body.message.chat.id)
                res.status(200)
            } else {
                res.status(400)
            }
        } else {
            res.status(400)
        }
    } catch (e) {
        res.status(400).json(e)
    }

})

app.listen(PORT, () => {
    console.log(`server successfully started on port ${PORT}`)
})