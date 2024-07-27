const admin=require('firebase-admin')
const serviceAccount = require("../serviceAccountKey.json");
 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db=admin.firestore()
async function fetchOrderItemsDetails(orderId){
    const ordersRef=db.collection('orders').doc(orderId);
    const ordersResponse=await ordersRef.get()
    const finalDetails=await Promise.all(ordersResponse.data().orderItems.map(async(item)=>{
        console.log(item.productId)
        const productsRef = db.collection("products").where('pid','==',item.productId);
        const productResponse = await productsRef.get();
        const {title,price}=productResponse.docs[0].data()
        return {quantity:item.quantity,title,price}
    }))
    return finalDetails
}
module.exports={fetchOrderItemsDetails}