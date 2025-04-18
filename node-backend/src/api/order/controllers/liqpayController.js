import LiqPay from 'liqpay';

const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY);

export function createLiqPayForm(amount, orderId) {
  const html = liqpay.cnb_form({
    action: 'pay',
    amount,
    currency: 'UAH',
    description: 'Оплата замовлення',
    order_id: orderId,
    version: '3',
    language: 'uk',
    result_url: `${process.env.DOMAIN}/checkout/success`,
    server_url: `${process.env.DOMAIN}/api/liqpay-callback`,
  });

  return `<html><body><h1>LiqPay Form</h1><p>Amount: ${amount}</p><p>Order: ${orderId}</p></body></html>`;
}
