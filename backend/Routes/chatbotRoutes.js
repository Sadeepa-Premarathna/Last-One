const express = require('express');
const router = express.Router();
const {
  handleChatbotQuery,
  getChatbotSuggestions
} = require('../Controllers/chatbotController');

// Chatbot routes
router.post('/query', handleChatbotQuery);
router.get('/suggestions', getChatbotSuggestions);

module.exports = router;
