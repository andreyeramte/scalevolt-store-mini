const LiqPay = require('liqpay');

const liqpay = new LiqPay(process.env.LIQPAY_PUBLIC_KEY, process.env.LIQPAY_PRIVATE_KEY);

module.exports = {
  async create(ctx) {
    const { amount, orderId } = ctx.request.body;

    const html = liqpay.cnb_form({
        action: 'pay',
        amount,
        currency: 'UAH',
        description: 'Оплата замовлення',
        order_id: orderId,
        version: '3',
        language: 'uk',
        result_url: 'https://yourdomain.com/checkout-success',
        server_url: 'https://yourdomain.com/api/liqpay-callback'
    });

    ctx.send({ html });
  }
};
