const Product = require('../models/Product.model');
const WhatsAppService = require('../services/whatsapp.service');
const EmailService = require('../services/email.service');

// ... (keep existing product controller code, but update updateProduct function)

/**
 * Update product (admin only)
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle stock quantity changes
    if (updateData.stockQuantity !== undefined) {
      const oldStock = existingProduct.stockQuantity;
      const newStock = updateData.stockQuantity;
      
      // Check for low stock alert
      if (oldStock > 5 && newStock <= 5) {
        try {
          await EmailService.sendLowStockAlert(existingProduct, newStock);
          await WhatsAppService.sendLowStockAlert(existingProduct, newStock);
        } catch (notificationError) {
          console.error('Low stock notification error:', notificationError);
        }
      }
      
      // Update inStock status
      updateData.inStock = newStock > 0;
    }

    // Handle image upload (if any)
    if (req.files && req.files.length > 0) {
      // In production, you would upload to Cloudinary
      const imageUrls = req.files.map(file => 
        `/uploads/${file.filename}`
      );
      updateData.images = imageUrls;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    next(error);
  }
};

// ... (rest of the product controller remains the same)
