import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  List,
  ListItem,
  Button,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  Badge,
} from '@mui/material';
import {
  Chat,
  Send,
  Mic,
  MicOff,
  Close,
  SmartToy,
  Person,
  ShoppingCart,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'order';
  productData?: {
    _id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    unit: string;
    brand: string;
  };
}

interface SuggestedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  unit: string;
  brand: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m DairyBot, your personal Dairy Licious shopping assistant. I can help you find products, place orders, and answer questions about our premium dairy products. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sample product data (in real app, this would come from API)
  const sampleProducts: SuggestedProduct[] = [
    {
      _id: '1',
      name: 'Dairy Licious Organic Whole Milk',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      description: 'Fresh organic whole milk from grass-fed cows, a Dairy Licious premium product',
      category: 'milk',
      unit: 'liter',
      brand: 'Dairy Licious',
    },
    {
      _id: '2',
      name: 'Dairy Licious Artisan Cheddar Cheese',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
      description: 'Aged artisan cheddar cheese with rich flavor, crafted by Dairy Licious experts',
      category: 'cheese',
      unit: 'kg',
      brand: 'Dairy Licious',
    },
    {
      _id: '3',
      name: 'Dairy Licious Greek Yogurt',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1571212059353-05d1e2c5c8b5?w=400',
      description: 'Creamy Greek yogurt packed with protein, made with Dairy Licious quality',
      category: 'yogurt',
      unit: 'pack',
      brand: 'Dairy Licious',
    },
  ];

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processUserMessage = async (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Simulate AI processing delay
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTyping(false);

    let botResponse = '';
    let responseType: 'text' | 'product' | 'order' = 'text';
    let productData: any = null;

    // Simple NLP-like processing
    if (lowerText.includes('milk') || lowerText.includes('dairy')) {
      const milkProduct = sampleProducts.find(p => p.category === 'milk');
      if (milkProduct) {
        botResponse = `I found some great Dairy Licious milk options for you! Here's our premium organic whole milk:`;
        responseType = 'product';
        productData = milkProduct;
      }
    } else if (lowerText.includes('cheese')) {
      const cheeseProduct = sampleProducts.find(p => p.category === 'cheese');
      if (cheeseProduct) {
        botResponse = `Perfect! Here's our Dairy Licious artisan cheddar cheese:`;
        responseType = 'product';
        productData = cheeseProduct;
      }
    } else if (lowerText.includes('yogurt')) {
      const yogurtProduct = sampleProducts.find(p => p.category === 'yogurt');
      if (yogurtProduct) {
        botResponse = `Great choice! Here's our Dairy Licious premium Greek yogurt:`;
        responseType = 'product';
        productData = yogurtProduct;
      }
    } else if (lowerText.includes('order') || lowerText.includes('buy') || lowerText.includes('purchase')) {
      botResponse = `I'd be happy to help you place an order for our premium Dairy Licious products! What dairy items would you like to add to your cart? You can ask me about milk, cheese, yogurt, or browse our full catalog.`;
    } else if (lowerText.includes('help') || lowerText.includes('what can you do')) {
      botResponse = `I can help you with:
🥛 Finding premium Dairy Licious products
🛒 Adding items to your cart
📦 Placing orders for fresh dairy
❓ Answering questions about our products
🗣️ Voice commands (click the mic button!)

Just tell me what delicious dairy products you're craving!`;
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      botResponse = `Hello! 😊 Welcome to Dairy Licious! I'm here to help you find the perfect premium dairy products. What are you craving today?`;
    } else {
      botResponse = `I understand you're interested in "${text}". Let me suggest some of our popular Dairy Licious products that might interest you! Would you like to see our milk, cheese, or yogurt selection?`;
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date(),
      type: responseType,
      productData,
    };

    setMessages(prev => [...prev, botMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputText;
    setInputText('');

    await processUserMessage(messageText);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const addToCart = (product: SuggestedProduct) => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      brand: product.brand,
    });

    const confirmMessage: Message = {
      id: Date.now().toString(),
      text: `Great! I've added ${product.name} to your cart. Would you like to add anything else or proceed to checkout?`,
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, confirmMessage]);
  };

  const renderMessage = (message: Message) => {
    const isBot = message.sender === 'bot';

    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ListItem
          sx={{
            display: 'flex',
            justifyContent: isBot ? 'flex-start' : 'flex-end',
            px: 2,
            py: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: isBot ? 'row' : 'row-reverse',
              alignItems: 'flex-start',
              maxWidth: '80%',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isBot ? 'primary.main' : 'secondary.main',
                mx: 1,
              }}
            >
              {isBot ? <SmartToy /> : <Person />}
            </Avatar>
            <Box>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: isBot ? 'grey.100' : 'primary.main',
                  color: isBot ? 'text.primary' : 'white',
                  borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {message.text}
                </Typography>
              </Paper>

              {/* Product Card */}
              {message.type === 'product' && message.productData && (
                <Card sx={{ mt: 2, maxWidth: 300 }}>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={message.productData.image}
                      alt={message.productData.name}
                      style={{
                        width: '100%',
                        height: 150,
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      {message.productData.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {message.productData.description}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      ${message.productData.price}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      onClick={() => message.productData && addToCart(message.productData as any as SuggestedProduct)}
                      sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                      }}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              )}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  textAlign: isBot ? 'left' : 'right',
                }}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Box>
        </ListItem>
      </motion.div>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)',
          },
        }}
      >
        <Badge badgeContent={messages.length > 1 ? messages.length - 1 : 0} color="secondary">
          <Chat />
        </Badge>
      </Fab>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            style={{
              position: 'fixed',
              bottom: 100,
              right: 24,
              zIndex: 1400,
              width: 400,
              height: 600,
            }}
          >
            <Paper
              elevation={8}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                  color: 'white',
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                    <SmartToy />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Dairy Licious Bot
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.9 }}>
                      Online • Ready to help with premium dairy
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => setIsOpen(false)}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Box>

              {/* Messages */}
              <Box sx={{ flex: 1, overflow: 'auto', bgcolor: '#fafafa' }}>
                <List sx={{ p: 0 }}>
                  {messages.map(renderMessage)}
                  {isTyping && (
                    <ListItem sx={{ px: 2, py: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mr: 1 }}>
                        <SmartToy />
                      </Avatar>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          bgcolor: 'grey.100',
                          borderRadius: '16px 16px 16px 4px',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="body2" color="text.secondary">
                            DairyBot is thinking...
                          </Typography>
                        </Box>
                      </Paper>
                    </ListItem>
                  )}
                </List>
                <div ref={messagesEndRef} />
              </Box>

              {/* Input */}
              <Box sx={{ p: 2, bgcolor: 'white', borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message or ask about dairy products..."
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <IconButton
                    onClick={isListening ? stopListening : startListening}
                    color={isListening ? 'secondary' : 'default'}
                    sx={{
                      bgcolor: isListening ? 'secondary.light' : 'transparent',
                    }}
                  >
                    {isListening ? <MicOff /> : <Mic />}
                  </IconButton>
                  <IconButton
                    onClick={handleSendMessage}
                    color="primary"
                    disabled={!inputText.trim()}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      '&.Mui-disabled': {
                        bgcolor: 'grey.300',
                        color: 'grey.500',
                      },
                    }}
                  >
                    <Send />
                  </IconButton>
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label="🥛 Milk"
                    size="small"
                    onClick={() => setInputText('I want to buy milk')}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label="🧀 Cheese"
                    size="small"
                    onClick={() => setInputText('Show me cheese options')}
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label="🥛 Yogurt"
                    size="small"
                    onClick={() => setInputText('I need yogurt')}
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
