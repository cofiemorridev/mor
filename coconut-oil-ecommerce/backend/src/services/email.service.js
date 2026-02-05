/**
 * Email service for sending order notifications
 * In demo mode, this just logs to console
 */

/**
 * Send order confirmation email to customer
 * @param {Object} order - Order object
 */
const sendOrderConfirmation = async (order) => {
  try {
    console.log(`📧 [DEMO] Order confirmation email would be sent to: ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Total: GHS ${order.total}`);
    console.log(`   Items: ${order.items.length} item(s)`);
    console.log(`   Shipping to: ${order.shippingAddress.street}, ${order.shippingAddress.city}`);
    
    // Demo email template
    const emailTemplate = `
    ===============================
    ORDER CONFIRMATION (DEMO MODE)
    ===============================
    Order Number: ${order.orderNumber}
    Date: ${new Date(order.createdAt).toLocaleDateString()}
    
    CUSTOMER INFORMATION:
    Name: ${order.customerInfo.name}
    Email: ${order.customerInfo.email}
    Phone: ${order.customerInfo.phone}
    
    SHIPPING ADDRESS:
    ${order.shippingAddress.street}
    ${order.shippingAddress.city}, ${order.shippingAddress.region}
    ${order.shippingAddress.country}
    
    ORDER SUMMARY:
    ${order.items.map((item, index) => 
      `${index + 1}. ${item.name} - ${item.quantity} x GHS ${item.price} = GHS ${item.quantity * item.price}`
    ).join('\n    ')}
    
    Subtotal: GHS ${order.subtotal}
    Delivery Fee: GHS ${order.deliveryFee}
    Total: GHS ${order.total}
    
    Payment Method: ${order.paymentMethod}
    Order Status: ${order.orderStatus}
    
    Estimated Delivery: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}
    
    Thank you for your order!
    ===============================
    `;
    
    console.log('\n' + emailTemplate);
    
    return { success: true, message: 'Email logged (demo mode)' };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send admin notification for new order
 * @param {Object} order - Order object
 */
const sendAdminNotification = async (order) => {
  try {
    console.log(`📧 [DEMO] Admin notification for new order: ${order.orderNumber}`);
    console.log(`   Customer: ${order.customerInfo.name}`);
    console.log(`   Phone: ${order.customerInfo.phone}`);
    console.log(`   Email: ${order.customerInfo.email}`);
    console.log(`   Total: GHS ${order.total}`);
    console.log(`   Payment: ${order.paymentMethod} (${order.paymentStatus})`);
    console.log(`   Region: ${order.shippingAddress.region}`);
    
    // Admin notification template
    const adminTemplate = `
    ===============================
    NEW ORDER ALERT (DEMO MODE)
    ===============================
    Order: ${order.orderNumber}
    Time: ${new Date().toLocaleString()}
    
    CUSTOMER:
    ${order.customerInfo.name}
    ${order.customerInfo.email}
    ${order.customerInfo.phone}
    ${order.customerInfo.whatsappNumber ? `WhatsApp: ${order.customerInfo.whatsappNumber}` : ''}
    
    ORDER VALUE: GHS ${order.total}
    
    SHIPPING TO:
    ${order.shippingAddress.street}
    ${order.shippingAddress.city}, ${order.shippingAddress.region}
    
    ITEMS (${order.items.length}):
    ${order.items.map((item, index) => 
      `${index + 1}. ${item.name} - ${item.quantity} x GHS ${item.price}`
    ).join('\n    ')}
    
    ACTION REQUIRED:
    1. Verify payment status
    2. Prepare order for shipping
    3. Update order status
    ===============================
    `;
    
    console.log('\n' + adminTemplate);
    
    return { success: true, message: 'Admin notification logged (demo mode)' };
  } catch (error) {
    console.error('Admin notification error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send order status update email
 * @param {Object} order - Order object
 * @param {String} oldStatus - Previous order status
 */
const sendOrderStatusUpdate = async (order, oldStatus) => {
  try {
    console.log(`📧 [DEMO] Order status update email would be sent to: ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Status changed from "${oldStatus}" to "${order.orderStatus}"`);
    
    const statusUpdateTemplate = `
    ===============================
    ORDER STATUS UPDATE (DEMO MODE)
    ===============================
    Order Number: ${order.orderNumber}
    
    STATUS UPDATE:
    Your order status has been updated from
    "${oldStatus}" to "${order.orderStatus}"
    
    ${order.orderStatus === 'shipped' ? `Tracking information will be provided soon.` : ''}
    ${order.orderStatus === 'delivered' ? `Your order has been delivered successfully!` : ''}
    ${order.orderStatus === 'cancelled' ? `Your order has been cancelled. Refund will be processed.` : ''}
    
    CURRENT STATUS: ${order.orderStatus.toUpperCase()}
    ${order.orderStatus === 'delivered' ? `Delivered at: ${order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}` : ''}
    
    Need help? Contact us at support@coconutoil.com
    ===============================
    `;
    
    console.log('\n' + statusUpdateTemplate);
    
    return { success: true, message: 'Status update logged (demo mode)' };
  } catch (error) {
    console.error('Status update email error:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Send payment confirmation email
 * @param {Object} order - Order object
 */
const sendPaymentConfirmation = async (order) => {
  try {
    console.log(`📧 [DEMO] Payment confirmation email would be sent to: ${order.customerInfo.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Amount: GHS ${order.total}`);
    console.log(`   Payment reference: ${order.paystackReference || 'N/A'}`);
    console.log(`   Payment method: ${order.paymentMethod}`);
    console.log(`   Payment status: ${order.paymentStatus}`);
    
    const paymentTemplate = `
    ===============================
    PAYMENT CONFIRMATION (DEMO MODE)
    ===============================
    Order Number: ${order.orderNumber}
    Payment Date: ${order.paidAt ? new Date(order.paidAt).toLocaleDateString() : new Date().toLocaleDateString()}
    
    PAYMENT DETAILS:
    Amount: GHS ${order.total}
    Payment Method: ${order.paymentMethod}
    Reference: ${order.paystackReference || 'N/A'}
    Status: ${order.paymentStatus}
    
    ORDER STATUS:
    Your order is now being processed.
    You will receive updates on your order status.
    
    NEXT STEPS:
    1. Order confirmation
    2. Order processing
    3. Shipping preparation
    4. Delivery
    
    Estimated Delivery: ${new Date(order.estimatedDeliveryDate).toLocaleDateString()}
    
    Thank you for your payment!
    ===============================
    `;
    
    console.log('\n' + paymentTemplate);
    
    return { success: true, message: 'Payment confirmation logged (demo mode)' };
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendOrderConfirmation,
  sendAdminNotification,
  sendOrderStatusUpdate,
  sendPaymentConfirmation
};
