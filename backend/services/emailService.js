const sgMail = require('@sendgrid/mail');

const sendgridApiKey = process.env.SENDGRID_API_KEY || '';
const sendgridEnabled = sendgridApiKey.startsWith('SG.');

if (sendgridEnabled) {
  sgMail.setApiKey(sendgridApiKey);
} else {
  console.warn('SendGrid disabled: missing or invalid SENDGRID_API_KEY');
}

const emailTemplates = {
  orderConfirmation: (order, customerEmail) => ({
    to: customerEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME || 'ARWAS World'
    },
    subject: `Order Confirmation - ${order.orderNumber}`,
    html: `
      <h2>Order Confirmed!</h2>
      <p>Hi ${order.customerName},</p>
      <p>Thank you for your order. Here are the details:</p>
      
      <h3>Order #${order.orderNumber}</h3>
      <p><strong>Amount:</strong> KES ${order.totalAmount?.toLocaleString()}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      
      <h4>Order Items:</h4>
      <ul>
        ${order.items?.map(item => `<li>${item.quantity}x ${item.productName} - KES ${item.totalPrice?.toLocaleString()}</li>`).join('')}
      </ul>
      
      ${order.source === 'whatsapp' 
        ? `<p><strong>Next Step:</strong> Our team will contact you via WhatsApp at ${order.customerPhone} to arrange payment and confirm your order details.</p>` 
        : `<p><strong>Payment Method:</strong> M-Pesa - Please complete your payment to activate the order.</p>`}
      
      <p>You can track your order status at: <a href="${process.env.FRONTEND_URL}/orders">View My Orders</a></p>
      
      <p>Need help? Contact us via WhatsApp: <a href="https://wa.me/254112126757">+254 112 126757</a></p>
      
      <hr>
      <p><small>© ARWAS World - Custom Apparel & Design</small></p>
    `
  }),

  orderStatusUpdate: (order, customerEmail) => ({
    to: customerEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME || 'ARWAS World'
    },
    subject: `Order Update - ${order.orderNumber}`,
    html: `
      <h2>Order Status Update</h2>
      <p>Hi ${order.customerName},</p>
      <p>Your order has been updated:</p>
      
      <h3>Order #${order.orderNumber}</h3>
      <p><strong>Status:</strong> ${order.status.replace('-', ' ').toUpperCase()}</p>
      
      ${order.deliveryDetails?.trackingNumber 
        ? `<p><strong>Tracking:</strong> ${order.deliveryDetails.trackingNumber}</p>
           <p><strong>Carrier:</strong> ${order.deliveryDetails.shippingCompany}</p>` 
        : ''}
      
      ${order.deliveryDetails?.estimatedDeliveryDate 
        ? `<p><strong>Expected Delivery:</strong> ${new Date(order.deliveryDetails.estimatedDeliveryDate).toLocaleDateString()}</p>` 
        : ''}
      
      ${order.internalNotes 
        ? `<p><strong>Notes:</strong> ${order.internalNotes}</p>` 
        : ''}
      
      <p><a href="${process.env.FRONTEND_URL}/orders">View Full Order Details</a></p>
      
      <hr>
      <p><small>© ARWAS World - Custom Apparel & Design</small></p>
    `
  }),

  adminNewOrder: (order) => ({
    to: process.env.ADMIN_EMAIL,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: process.env.SENDGRID_FROM_NAME || 'ARWAS World'
    },
    subject: `[NEW ORDER] ${order.orderNumber} - ${order.customerName}`,
    html: `
      <h2>🎉 New Order Received!</h2>
      
      <h3>Order #${order.orderNumber}</h3>
      <p><strong>Source:</strong> ${order.source === 'whatsapp' ? 'WhatsApp' : 'App (M-Pesa)'}</p>
      
      <h4>Customer Details:</h4>
      <ul>
        <li><strong>Name:</strong> ${order.customerName}</li>
        <li><strong>Email:</strong> ${order.customerEmail}</li>
        <li><strong>Phone:</strong> ${order.customerPhone}</li>
        <li><strong>Country:</strong> ${order.customerCountry}</li>
      </ul>
      
      <h4>Items (${order.items?.length || 0}):</h4>
      <ul>
        ${order.items?.map(item => `
          <li>
            ${item.quantity}x ${item.productName}<br>
            Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}<br>
            Printing: ${item.printingMethod} | Total: KES ${item.totalPrice?.toLocaleString()}
          </li>
        `).join('')}
      </ul>
      
      <h4>Order Summary:</h4>
      <p><strong>Total Amount:</strong> KES ${order.totalAmount?.toLocaleString()}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
      
      ${order.notes ? `<p><strong>Customer Notes:</strong> ${order.notes}</p>` : ''}
      
      <p><a href="${process.env.ADMIN_URL}/admin/orders/${order._id}">View in Admin Panel</a></p>
      
      <hr>
      <p><small>ARWAS World Admin Notification</small></p>
    `
  })
};

const sendEmail = async (templateName, data) => {
  try {
    if (!sendgridEnabled) {
      return { success: false, error: 'SendGrid is not configured' };
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    const message = typeof template === 'function' ? template(...Object.values(data)) : template;
    
    await sgMail.send(message);
    console.log(`✓ Email sent: ${templateName} to ${message.to}`);
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error(`✗ Email error (${templateName}):`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  emailTemplates
};
