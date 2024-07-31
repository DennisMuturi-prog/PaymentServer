const axios = require("axios");
const { format } = require("date-fns");
require("dotenv").config();
const shortCode = 174379;

// Retrieve the two strings from the environment variables
const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;

// Concatenate the two strings
const concatenatedString = `${consumerKey}:${consumerSecret}`;

// Encode the concatenated string to base64
const authorizationHeader = new Buffer.from(concatenatedString).toString("base64");
async function getAccessToken(){
      const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${authorizationHeader}`,
          },
        }
      );
      return response.data.access_token
}

async function stkPush(amount, phoneNumber, access_token) {
  const Timestamp = format(new Date(), "yyyyMMddHHmmss");
  const concatenatedString = `${shortCode}${process.env.PASS_KEY}${Timestamp}`;
  const Password = new Buffer.from(concatenatedString).toString("base64");
  const response = await axios.post(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      BusinessShortCode: shortCode,
      Password,
      Timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Number(amount),
      PartyA: Number(`254${phoneNumber}`),
      PartyB: shortCode,
      PhoneNumber: Number(`254${phoneNumber}`),
      CallBackURL: "https://a799-196-216-86-84.ngrok-free.app/successPayment",
      AccountReference: "muturi biz",
      TransactionDesc: "You guy",
    },
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
}
module.exports={getAccessToken,stkPush}
