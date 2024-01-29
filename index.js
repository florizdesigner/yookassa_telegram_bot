const express = require('express')
require('dotenv').config()

const {createYookassaPayment} = require('./helpers/yookassa.helper')
const {sendPaymentLink, telegramEditMessage} = require('./helpers/telegrambot.helper')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3001

app.post('/payment', async (req, res) => {
    try {
        if (req.body.object.status === "succeeded" || req.body.object.status === "waiting_for_capture") {
            await telegramEditMessage(`Thanks! Payment was successful, id: ${req.body.object.id}`, req.body.object.metadata.user_id, req.body.object.metadata.message_id)
            res.sendStatus(200)
        }

    } catch (e) {
        res.sendStatus(400).json(e)
    }
})

app.post('/telegram', async (req, res) => {
    if (req.body.message.text.includes("/pay")) {
            const payment = await createYookassaPayment(req.body.message.text.split(' ')[1], req.body.message.chat.id, req.body.message.message_id)
            await sendPaymentLink(payment.confirmation.confirmation_url, req.body.message.chat.id)
            res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }

})

app.listen(PORT, () => console.log(`server started on port ${PORT} successful!`))