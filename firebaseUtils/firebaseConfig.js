const admin = require('firebase-admin')
// const serviceAccount = require("../serviceAccountKey.json");
//  admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
admin.initializeApp({ projectId: 'angularworkproject' });
const db = admin.firestore()
async function fetchOrderItemsDetails(orderId) {
  const ordersRef = db.collection('orders').doc(orderId);
  const ordersResponse = await ordersRef.get()
  const finalDetails = await Promise.all(ordersResponse.data().orderItems.map(async (item) => {
    const productsRef = db.collection("products").where('pid', '==', item.productId);
    const productResponse = await productsRef.get();
    const { title, price } = productResponse.docs[0].data()
    return { quantity: item.quantity, title, price }
  }))
  return finalDetails
}
async function updateOrderPaymentDetails(orderId, sessionId) {
  const ordersRef = db.collection('orders').doc(orderId)
  await ordersRef.update({ typeOfPayment: 'stripe', sessionId })
}
async function changePaymentCompletionStatus(sessionId) {
  console.log(sessionId)
  const ordersRef = db.collection("orders").where('sessionId', '==', sessionId)
  const orders = await ordersRef.get()
  console.log('orderId', orders.docs[0].id)
  const orderRef = db.collection("orders").doc(orders.docs[0].id)
  await orderRef.update({ paid: true, shipped: false });
  const cartItemsRef = db
    .collection("cartItems")
    .where("userId", "==", orders.docs[0].data().userId);
  const cartItems = await cartItemsRef.get()
  cartItems.docs.forEach(async (item) => {
    const itemRef = db.collection('cartItems').doc(item.id)
    await itemRef.delete()
  })
}

async function get_products() {
  const productsSnapshot = await db.collection("products").get();
  return productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
function getTotalPrice(orderItems) {
  return orderItems.reduce((acc, curr) => acc + curr.quantity * curr.price, 0)
}
module.exports = { fetchOrderItemsDetails, getTotalPrice, updateOrderPaymentDetails, changePaymentCompletionStatus, get_products }