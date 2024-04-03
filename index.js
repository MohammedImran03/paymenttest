require("dotenv").config();
const express = require("express");
const app = express();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");
const PORT = process.env.PORT || 6000;

app.use("/stripe", express.raw({ type: "*/*" }));
app.use(express.json());
app.use(cors());

app.post("/buy", async (req, res) => {
    try {
      let {amount } = req.body;
     
      if (!amount)
        return res.status(400).json({ message: "Invalid data" });
          amount = parseInt(amount);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        payment_method_types: ["card"],
        metadata: { amount },
      });

      const clientSecret = paymentIntent.client_secret;
     
      res.json({ message: "Payment initiated", clientSecret });
    } catch (err) {
      
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
