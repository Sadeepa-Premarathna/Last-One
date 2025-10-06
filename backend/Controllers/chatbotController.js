const Product = require('../Model/Product');

// Handle chatbot queries
const handleChatbotQuery = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const userMessage = message.toLowerCase();
    let response = '';

    // Greetings
    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
      response = "Hello! Welcome to DairyLicious! 🥛 I'm here to help you find the best dairy products. How can I assist you today?";
    }
    
    // Product search queries
    else if (userMessage.includes('milk') || userMessage.includes('dairy')) {
      try {
        const milkProducts = await Product.find({
          $or: [
            { name: { $regex: 'milk', $options: 'i' } },
            { category: { $regex: 'milk', $options: 'i' } },
            { description: { $regex: 'milk', $options: 'i' } }
          ],
          inStock: true
        }).limit(3);

        if (milkProducts.length > 0) {
          response = "Here are some popular milk products:\n\n";
          milkProducts.forEach(product => {
            response += `🥛 ${product.name} - $${product.price}\n`;
          });
          response += "\nWould you like to see more details about any of these products?";
        } else {
          response = "I couldn't find any milk products in stock right now. Please check back later!";
        }
      } catch (error) {
        response = "I'm having trouble finding milk products right now. Please try again later.";
      }
    }
    
    // Cheese queries
    else if (userMessage.includes('cheese')) {
      try {
        const cheeseProducts = await Product.find({
          $or: [
            { name: { $regex: 'cheese', $options: 'i' } },
            { category: { $regex: 'cheese', $options: 'i' } },
            { description: { $regex: 'cheese', $options: 'i' } }
          ],
          inStock: true
        }).limit(3);

        if (cheeseProducts.length > 0) {
          response = "Here are some delicious cheese options:\n\n";
          cheeseProducts.forEach(product => {
            response += `🧀 ${product.name} - $${product.price}\n`;
          });
          response += "\nWould you like more information about any of these cheeses?";
        } else {
          response = "I couldn't find any cheese products in stock right now. Please check back later!";
        }
      } catch (error) {
        response = "I'm having trouble finding cheese products right now. Please try again later.";
      }
    }
    
    // Yogurt queries
    else if (userMessage.includes('yogurt') || userMessage.includes('yoghurt')) {
      try {
        const yogurtProducts = await Product.find({
          $or: [
            { name: { $regex: 'yogurt|yoghurt', $options: 'i' } },
            { category: { $regex: 'yogurt|yoghurt', $options: 'i' } },
            { description: { $regex: 'yogurt|yoghurt', $options: 'i' } }
          ],
          inStock: true
        }).limit(3);

        if (yogurtProducts.length > 0) {
          response = "Here are some creamy yogurt options:\n\n";
          yogurtProducts.forEach(product => {
            response += `🥄 ${product.name} - $${product.price}\n`;
          });
          response += "\nWould you like to know more about any of these yogurts?";
        } else {
          response = "I couldn't find any yogurt products in stock right now. Please check back later!";
        }
      } catch (error) {
        response = "I'm having trouble finding yogurt products right now. Please try again later.";
      }
    }
    
    // Price inquiries
    else if (userMessage.includes('price') || userMessage.includes('cost') || userMessage.includes('cheap') || userMessage.includes('expensive')) {
      try {
        const cheapProducts = await Product.find({ inStock: true })
          .sort({ price: 1 })
          .limit(3);

        if (cheapProducts.length > 0) {
          response = "Here are some of our most affordable products:\n\n";
          cheapProducts.forEach(product => {
            response += `💰 ${product.name} - $${product.price}\n`;
          });
          response += "\nWe offer competitive prices on all our dairy products!";
        } else {
          response = "I'm having trouble finding product prices right now. Please try again later.";
        }
      } catch (error) {
        response = "I'm having trouble finding pricing information right now. Please try again later.";
      }
    }
    
    // Help and support
    else if (userMessage.includes('help') || userMessage.includes('support')) {
      response = "I'm here to help! 😊 You can ask me about:\n\n";
      response += "🥛 Milk products\n";
      response += "🧀 Cheese varieties\n";
      response += "🥄 Yogurt options\n";
      response += "💰 Product prices\n";
      response += "📦 Stock availability\n";
      response += "🛒 How to place orders\n\n";
      response += "What would you like to know more about?";
    }
    
    // Shopping cart help
    else if (userMessage.includes('cart') || userMessage.includes('order') || userMessage.includes('buy')) {
      response = "To add items to your cart:\n\n";
      response += "1. Browse our products\n";
      response += "2. Click 'Add to Cart' on items you like\n";
      response += "3. View your cart using the cart icon\n";
      response += "4. Proceed to checkout when ready\n\n";
      response += "Need help finding specific products? Just ask! 🛒";
    }
    
    // Stock availability
    else if (userMessage.includes('stock') || userMessage.includes('available')) {
      try {
        const inStockCount = await Product.countDocuments({ inStock: true });
        response = `We currently have ${inStockCount} products in stock! 📦\n\n`;
        response += "You can check individual product availability on each product page. ";
        response += "Is there a specific product you're looking for?";
      } catch (error) {
        response = "I'm having trouble checking stock availability right now. Please try again later.";
      }
    }
    
    // Delivery/shipping
    else if (userMessage.includes('delivery') || userMessage.includes('shipping')) {
      response = "🚚 Delivery Information:\n\n";
      response += "• Free delivery on orders over $50\n";
      response += "• Standard delivery: 2-3 business days\n";
      response += "• Express delivery: Next day (additional charges apply)\n";
      response += "• We deliver fresh dairy products with proper refrigeration\n\n";
      response += "Would you like to place an order?";
    }
    
    // About company
    else if (userMessage.includes('about') || userMessage.includes('company')) {
      response = "About DairyLicious 🥛\n\n";
      response += "We're your trusted source for fresh, high-quality dairy products! ";
      response += "From farm-fresh milk to artisan cheeses and creamy yogurts, ";
      response += "we bring you the finest dairy products delivered right to your door.\n\n";
      response += "Our mission is to make premium dairy accessible to everyone!";
    }
    
    // Default response
    else {
      response = "I'd love to help you with that! 😊 Could you please be more specific? ";
      response += "You can ask me about milk, cheese, yogurt, prices, or how to place orders. ";
      response += "What are you looking for today?";
    }

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'I apologize, but I\'m experiencing technical difficulties. Please try again later.'
    });
  }
};

// Get chatbot suggestions
const getChatbotSuggestions = async (req, res) => {
  try {
    const suggestions = [
      "Show me milk products",
      "What cheese do you have?",
      "I need yogurt options",
      "What are your cheapest products?",
      "How do I place an order?",
      "Do you deliver?",
      "What's in stock today?",
      "Tell me about your company"
    ];

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suggestions'
    });
  }
};

module.exports = {
  handleChatbotQuery,
  getChatbotSuggestions
};
