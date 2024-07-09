import express from 'express';
import stripe from 'stripe';
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const port = 3000;
const strip = new stripe(process.env.STRIPE_KEY)


app.get('/', (req, res) => {
    res.json({
        status: 'True',
        message: 'ok',
    })
})


app.post('/create-stripe-payment', async (req, res) => {
    try {
        const { amount, currency, paymentMethod } = req.body;

        const paymentIntent = await strip.paymentIntents.create({
            amount: amount * 100,
            currency,
            payment_method_types: [paymentMethod],
        });

        res.json({
            status: 'True',
            message: 'Payment intent created successfully',
            clientSecret: paymentIntent.client_secret,
        });
        console.log('Payment intent created successfully ', paymentIntent)
    } catch (error) {
        res.status(500).json({
            status: 'False',
            message: error.message,
        });
    }
})

app.post('/confirm-order', async (req, res) => {
    try {
        const { paymentIntent } = req.body;
        console.log(paymentIntent)
        res.json({
            status: 'True',
            message: 'Payment confirmed successfully',
        })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log('server is running on port: ' + port);
})