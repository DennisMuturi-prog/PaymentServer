require("dotenv").config();
const {getAccessToken,stkPush}=require('./Mpesa/mpesa')
const {fetchOrderItemsDetails,getTotalPrice,updateOrderPaymentDetails,changePaymentCompletionStatus, get_products}=require('./firebaseUtils/firebaseConfig')
const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const PORT=process.env.PORT || 3000
const corsOptions = {
  origin: [
    "http://localhost:4200",
    "https://ecommerce-965194135392.europe-west9.run.app"
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
async function getAuthToken(req, res, next) {
  try {
    const token = await getAccessToken();
    req.access_token = token;
    next();
  } catch (error) {
    console.log(error)
    res.status(502).json({err:error.message});
  }
}

app.post('/stripePayment',async (req,res)=>{
  try {
    console.log(req.body)
    const orderDetails=await fetchOrderItemsDetails(req.body.orderId)
    const session=await stripe.checkout.sessions.create({
      payment_method_types:["card"],
      line_items:orderDetails.map(item=>{
        return {
          price_data:{
            currency:'kes',
            product_data:{
              name:item.title
            },
            unit_amount:item.price*100,
          },
          quantity:item.quantity
        }
      }),
      mode:'payment',
      success_url:'https://ecommerce-965194135392.europe-west9.run.app/home',
      cancel_url:'https://ecommerce-965194135392.europe-west9.run.app/checkout',
    })
    console.log(session.id)
    await updateOrderPaymentDetails(req.body.orderId,session.id) 
    res.json({url:session.url})
    
  } catch (e) {
    console.log(e)
    res.status(500).json({error:e.message})
    
  }
})
app.post('/mpesa',getAuthToken,async (req,res)=>{
  console.log(req.body)
  try {
       const orderDetails = await fetchOrderItemsDetails(req.body.orderId);
       const amount=getTotalPrice(orderDetails)
        const stkResponse=await stkPush(amount,req.body.phoneNumber,req.access_token)
        console.log(stkResponse)
        res.status(200).json({customerMessage:stkResponse}) 
    } catch (error) {
      console.log('error 2',error)
        res.status(502).json({errMessage:error.message})  
    }
})
app.get('/',async (_,res)=>{
  const products=await get_products();
  res.json(products)
})

app.get('/hello',async (_,res)=>{
  res.send('hello')
})
app.post('/stripeWebHook',async(req,res)=>{
  console.log("stripe webhook triggered",req.body)
  try {
    const sessionId=req.body.data.object.id
    await changePaymentCompletionStatus(sessionId)
    
  } catch (error) {
    console.log(error)
    
  }
  res.json({received:true})
})
app.listen(PORT,()=>{
    console.log('running on port',PORT)
})

