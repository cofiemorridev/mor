const axios = require('axios');

class WhatsAppService {
  constructor() {
    this.apiToken = process.env.WHATSAPP_API_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.adminPhoneNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    this.apiUrl = `https://graph.facebook.com/v17.0/${this.phoneNumberId}/messages`;
  }

  /**
   * Send WhatsApp message using WhatsApp Business API
   */
  async sendMessage(to, templateName, languageCode, components) {
    try {
      // In production, use actual WhatsApp Business API
      if (process.env.NODE_ENV === 'production' && this.apiToken) {
        const response = await axios.post(
          this.apiUrl,
          {
            messaging_product: 'whatsapp',
            to: to.replace('+', ''),
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: languageCode || 'en'
              },
              components: components || []
            }
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('WhatsApp message sent:', response.data);
        return { success: true, data: response.data };
      } else {
        // In development/demo mode, log the message
        console.log('📱 WhatsApp Message (Demo Mode):');
        console.log('To:', to);
        console.log('Template:', templateName);
        console.log('Components:', JSON.stringify(components, null, 2));
        
        return { success: true, data: { message: 'Demo mode - message logged' } };
      }
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error?.message || error.message 
      };
    }
  }

  /**
   * Send order confirmation to customer
   */
  async sendOrderConfirmation(order) {
    try {
      const customerPhone = order.customerInfo.whatsappNumber || order.customerInfo.phone;
      if (!customerPhone) {
        return { success: false, error: 'No phone number provided' };
      }

      const orderItems = order.items.map(item => 
        `${item.name} x${item.quantity} - ₵${(item.price * item.quantity).toFixed(2)}`
      ).join('\n');

      const components = [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: order.customerInfo.name },
            { type: 'text', text: order.orderNumber },
            { type: 'text', text: orderItems },
            { type: 'text', text: `₵${order.total.toFixed(2)}` }
          ]
        },
        {
          type: 'button',
          sub_type: 'quick_reply',
          index: 0,
          parameters: [{ type: 'payload', payload: `order_${order.orderNumber}` }]
        }
      ];

      return await this.sendMessage(
        customerPhone,
        'order_confirmation',
        'en',
        components
      );
    } catch (error) {
      console.error('Error in sendOrderConfirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send payment confirmation to customer
   */
  async sendPaymentConfirmation(order) {
    try {
      const customerPhone = order.customerInfo.whatsappNumber || order.customerInfo.phone;
      if (!customerPhone) {
        return { success: false, error: 'No phone number provided' };
      }

      const components = [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: order.customerInfo.name },
            { type: 'text', text: order.orderNumber },
            { type: 'text', text: `₵${order.total.toFixed(2)}` },
            { type: 'text', text: order.paystackReference || 'N/A' }
          ]
        }
      ];

      return await this.sendMessage(
        customerPhone,
        'payment_confirmation',
        'en',
        components
      );
    } catch (error) {
      console.error('Error in sendPaymentConfirmation:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send order status update to customer
   */
  async sendOrderStatusUpdate(order, oldStatus, newStatus) {
    try {
      const customerPhone = order.customerInfo.whatsappNumber || order.customerInfo.phone;
      if (!customerPhone) {
        return { success: false, error: 'No phone number provided' };
      }

      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being processed.',
        'processing': 'Your order is now being prepared for shipping.',
        'shipped': 'Great news! Your order has been shipped.',
        'delivered': 'Your order has been delivered. Thank you for shopping with us!',
        'cancelled': 'Your order has been cancelled as requested.'
      };

      const components = [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: order.customerInfo.name },
            { type: 'text', text: order.orderNumber },
            { type: 'text', text: oldStatus },
            { type: 'text', text: newStatus },
            { type: 'text', text: statusMessages[newStatus] || `Status updated to: ${newStatus}` }
          ]
        }
      ];

      return await this.sendMessage(
        customerPhone,
        'order_status_update',
        'en',
        components
      );
    } catch (error) {
      console.error('Error in sendOrderStatusUpdate:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send new order notification to admin
   */
  async sendAdminNotification(order) {
    try {
      if (!this.adminPhoneNumber) {
        console.log('Admin WhatsApp number not configured');
        return { success: false, error: 'Admin WhatsApp number not configured' };
      }

      const orderSummary = order.items.map(item => 
        `${item.name} x${item.quantity}`
      ).join(', ');

      // For admin notifications, we can use a plain text message
      const message = `📦 NEW ORDER RECEIVED
      
Order #: ${order.orderNumber}
Customer: ${order.customerInfo.name}
Phone: ${order.customerInfo.phone}
Total: ₵${order.total.toFixed(2)}
Items: ${orderSummary}
Payment: ${order.paymentStatus}

View order: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/orders
`;

      // For demo purposes, we'll log it
      console.log('📱 Admin WhatsApp Notification:');
      console.log(message);

      // In production, this would be an actual WhatsApp message
      if (process.env.NODE_ENV === 'production' && this.apiToken) {
        // Use template message for admin
        const components = [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: order.orderNumber },
              { type: 'text', text: order.customerInfo.name },
              { type: 'text', text: `₵${order.total.toFixed(2)}` }
            ]
          }
        ];

        return await this.sendMessage(
          this.adminPhoneNumber,
          'admin_order_notification',
          'en',
          components
        );
      }

      return { success: true, data: { message: 'Admin notification logged' } };
    } catch (error) {
      console.error('Error in sendAdminNotification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send low stock alert to admin
   */
  async sendLowStockAlert(product, currentStock) {
    try {
      if (!this.adminPhoneNumber) {
        return { success: false, error: 'Admin WhatsApp number not configured' };
      }

      const message = `⚠️ LOW STOCK ALERT

Product: ${product.name}
Current Stock: ${currentStock} units
SKU: ${product.sku || 'N/A'}

Please restock soon to avoid stockouts.`;

      console.log('📱 Low Stock WhatsApp Alert:');
      console.log(message);

      return { success: true, data: { message: 'Low stock alert logged' } };
    } catch (error) {
      console.error('Error in sendLowStockAlert:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new WhatsAppService();
