require("dotenv").config();
const {fetchOrderItemsDetails}=require('./firebaseUtils/firebaseConfig')
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const PORT=process.env.PORT || 3000
const corsOptions = {
  origin: "http://localhost:4200",
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.post('/stripePayment',async (req,res)=>{
  try {
    console.log(req.body)
    const orderDetails=await fetchOrderItemsDetails(req.body.orderId)
    const session=await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:orderDetails.map(item=>{
        return {
          price_data:{
            currency:'usd',
            product_data:{
              name:item.title
            },
            unit_amount:item.price*100,
          },
          quantity:item.quantity
        }
      }),
      mode:'payment',
      success_url:'https://google.com',
      cancel_url:'https://youtube.com'
    })
    
    res.json({url:session.url})
    
  } catch (e) {
    console.log(e)
    res.status(500).json({error:e.message})
    
  }
})
app.listen(PORT,()=>{
    console.log('running on port',PORT)
})

