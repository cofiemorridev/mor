const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    this.from = process.env.EMAIL_FROM || 'Coconut Oil Ghana <hello@coconutoil.com>';
  }

  /**
   * Send email
   */
  async sendEmail(to, subject, html, attachments = []) {
    try {
      // In development/demo mode, log the email instead of sending
      if (process.env.NODE_ENV !== 'production') {
        console.log('📧 Email (Demo Mode):');
        console.log('To:', to);
        console.log('Subject:', subject);
        console.log('HTML content preview:', html.substring(0, 200) + '...');
        
        return { success: true, data: { message: 'Demo mode - email logged' } };
      }

      const mailOptions = {
        from: this.from,
        to,
        subject,
        html,
        attachments
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      
      return { success: true, data: info };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  /**
   * Generate template HTML
   */
  generateTemplateHTML(templateName, data) {
    const templates = {
      'order_confirmation': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation - Coconut Oil Ghana</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5016, #4a7c2c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .product-row { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total-row { font-weight: bold; padding-top: 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #4a7c2c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🥥 Order Confirmed!</h1>
            <p>Thank you for your purchase!</p>
          </div>
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Your order has been confirmed and is being processed. Here are your order details:</p>
            
            <div class="order-details">
              <h3>Order #${data.orderNumber}</h3>
              <p><strong>Date:</strong> ${data.orderDate}</p>
              <p><strong>Status:</strong> ${data.orderStatus}</p>
              
              <h4>Order Items:</h4>
              ${data.items.map(item => `
                <div class="product-row">
                  <p><strong>${item.name}</strong> x ${item.quantity}</p>
                  <p>₵${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              `).join('')}
              
              <div class="total-row">
                <p>Subtotal: ₵${data.subtotal.toFixed(2)}</p>
                <p>Delivery Fee: ₵${data.deliveryFee.toFixed(2)}</p>
                <p><strong>Total: ₵${data.total.toFixed(2)}</strong></p>
              </div>
            </div>
            
            <h4>Shipping Address:</h4>
            <p>${data.shippingAddress}</p>
            
            <p>We'll send you another email when your order ships. If you have any questions, please reply to this email.</p>
            
            <div style="text-align: center;">
              <a href="${data.orderLink}" class="button">View Order Details</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Coconut Oil Ghana</p>
            <p>Pure, natural coconut oil from Ghana</p>
            <p>© ${new Date().getFullYear()} Coconut Oil Ghana. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,

      'payment_confirmation': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmation - Coconut Oil Ghana</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5016, #4a7c2c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .payment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Payment Successful!</h1>
            <p>Your payment has been confirmed</p>
          </div>
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Your payment for order #${data.orderNumber} has been successfully processed.</p>
            
            <div class="payment-details">
              <h3>Payment Details</h3>
              <p><strong>Reference:</strong> ${data.paymentReference}</p>
              <p><strong>Amount Paid:</strong> ₵${data.amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
              <p><strong>Date:</strong> ${data.paymentDate}</p>
              <p><strong>Status:</strong> ${data.paymentStatus}</p>
            </div>
            
            <p>Your order is now being processed. You'll receive another email with shipping updates.</p>
            
            <p>Thank you for shopping with Coconut Oil Ghana!</p>
          </div>
          
          <div class="footer">
            <p>Coconut Oil Ghana</p>
            <p>Pure, natural coconut oil from Ghana</p>
            <p>© ${new Date().getFullYear()} Coconut Oil Ghana. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,

      'order_status_update': (data) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Status Update - Coconut Oil Ghana</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2d5016, #4a7c2c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-update { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📦 Order Status Update</h1>
            <p>Your order status has changed</p>
          </div>
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Your order #${data.orderNumber} has been updated:</p>
            
            <div class="status-update">
              <h3>Status Update</h3>
              <p><strong>Previous Status:</strong> ${data.oldStatus}</p>
              <p><strong>New Status:</strong> ${data.newStatus}</p>
              <p><strong>Update Date:</strong> ${data.updateDate}</p>
            </div>
            
            <p><strong>What this means:</strong> ${data.statusMessage}</p>
            
            ${data.trackingNumber ? `
              <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
              <p>You can track your shipment using the tracking number above.</p>
            ` : ''}
            
            <p>If you have any questions about your order, please reply to this email.</p>
          </div>
          
          <div class="footer">
            <p>Coconut Oil Ghana</p>
            <p>Pure, natural coconut oil from Ghana</p>
            <p>© ${new Date().getFullYear()} Coconut Oil Ghana. All rights reserved.</p>
          </div>
        </body>
        </html>
      `
    };

    const template = templates[templateName];
    return template ? template(data) : this.generateBasicTemplate(templateName, data);
  }

  /**
   * Generate basic template fallback
   */
  generateBasicTemplate(templateName, data) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2d5016; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Coconut Oil Ghana</h1>
          <p>${templateName.replace(/_/g, ' ').toUpperCase()}</p>
        </div>
        <div class="content">
          <p>Hello ${data.customerName || 'Customer'},</p>
          <p>${data.message || 'This is an automated message from Coconut Oil Ghana.'}</p>
          ${data.details ? `<pre>${JSON.stringify(data.details, null, 2)}</pre>` : ''}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Coconut Oil Ghana</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmation(order) {
    try {
      const html = this.generateTemplateHTML('order_confirmation', {
        customerName: order.customerInfo.name,
        orderNumber: order.orderNumber,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        orderStatus: order.orderStatus,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        shippingAddress: `
          ${order.shippingAddress.street},
          ${order.shippingAddress.city},
          ${order.shippingAddress.region},
          ${order.shippingAddress.country}
          ${order.shippingAddress.zipCode ? `, ${order.shippingAddress.zipCode}` : ''}
        `,
        orderLink: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/orders/${order.orderNumber}`
      });

      return await this.sendEmail(
        order.customerInfo.email,
        `Order Confirmation - #${order.orderNumber}`,
        html
      );
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmation(order) {
    try {
      const html = this.generateTemplateHTML('payment_confirmation', {
        customerName: order.customerInfo.name,
        orderNumber: order.orderNumber,
        paymentReference: order.paystackReference || 'N/A',
        amount: order.total,
        paymentMethod: order.paymentMethod,
        paymentDate: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        paymentStatus: order.paymentStatus
      });

      return await this.sendEmail(
        order.customerInfo.email,
        `Payment Confirmation - #${order.orderNumber}`,
        html
      );
    } catch (error) {
      console.error('Error in sendPaymentConfirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(order, oldStatus, newStatus) {
    try {
      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being processed.',
        'processing': 'Your order is now being prepared for shipping.',
        'shipped': 'Great news! Your order has been shipped and is on its way to you.',
        'delivered': 'Your order has been delivered. Thank you for shopping with us!',
        'cancelled': 'Your order has been cancelled as requested.'
      };

      const html = this.generateTemplateHTML('order_status_update', {
        customerName: order.customerInfo.name,
        orderNumber: order.orderNumber,
        oldStatus: oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1),
        newStatus: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
        updateDate: new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        statusMessage: statusMessages[newStatus] || `Order status updated to: ${newStatus}`,
        trackingNumber: order.trackingNumber || null
      });

      return await this.sendEmail(
        order.customerInfo.email,
        `Order Status Update - #${order.orderNumber}`,
        html
      );
    } catch (error) {
      console.error('Error in sendOrderStatusUpdate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send admin notification email
   */
  async sendAdminOrderNotification(order) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
      if (!adminEmail) {
        return { success: false, error: 'Admin email not configured' };
      }

      const orderSummary = order.items.map(item => 
        `${item.name} x${item.quantity} - ₵${(item.price * item.quantity).toFixed(2)}`
      ).join('<br>');

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .order-alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; }
            .order-details { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="order-alert">
            <h2>🚨 NEW ORDER RECEIVED</h2>
            <p>A new order has been placed on your store.</p>
          </div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> ${order.customerInfo.name}</p>
            <p><strong>Email:</strong> ${order.customerInfo.email}</p>
            <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
            <p><strong>WhatsApp:</strong> ${order.customerInfo.whatsappNumber || 'N/A'}</p>
            
            <h4>Shipping Address</h4>
            <p>${order.shippingAddress.street}, ${order.shippingAddress.city}<br>
            ${order.shippingAddress.region}, ${order.shippingAddress.country}<br>
            ${order.shippingAddress.zipCode || ''}</p>
            
            <h4>Order Items</h4>
            ${orderSummary}
            
            <h4>Payment Information</h4>
            <p><strong>Total Amount:</strong> ₵${order.total.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
            <p><strong>Payment Reference:</strong> ${order.paystackReference || 'N/A'}</p>
          </div>
          
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders/${order.orderNumber}">
            View Order in Admin Panel
          </a></p>
        </body>
        </html>
      `;

      return await this.sendEmail(
        adminEmail,
        `🚨 New Order: #${order.orderNumber}`,
        html
      );
    } catch (error) {
      console.error('Error in sendAdminOrderNotification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send low stock alert email to admin
   */
  async sendLowStockAlert(product, currentStock) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM;
      if (!adminEmail) {
        return { success: false, error: 'Admin email not configured' };
      }

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="alert">
            <h2>⚠️ LOW STOCK ALERT</h2>
            <p>The following product is running low on stock:</p>
          </div>
          
          <h3>Product Details</h3>
          <p><strong>Product Name:</strong> ${product.name}</p>
          <p><strong>Current Stock:</strong> ${currentStock} units</p>
          <p><strong>SKU:</strong> ${product.sku || 'N/A'}</p>
          <p><strong>Category:</strong> ${product.category || 'N/A'}</p>
          
          <p><em>Please restock this product soon to avoid stockouts.</em></p>
          
          <p><a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/products/${product._id}">
            View Product in Admin Panel
          </a></p>
        </body>
        </html>
      `;

      return await this.sendEmail(
        adminEmail,
        `⚠️ Low Stock Alert: ${product.name}`,
        html
      );
    } catch (error) {
      console.error('Error in sendLowStockAlert:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
