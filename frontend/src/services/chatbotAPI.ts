// Enhanced Chatbot API service
export const chatbotAPI = {
  sendMessage: async (message: string, sessionId?: string) => {
    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Chatbot API error:', error);
      throw error;
    }
  },

  getSuggestions: async () => {
    try {
      const response = await fetch('/api/chatbot/suggestions');
      if (!response.ok) {
        throw new Error('Failed to get suggestions');
      }
      return await response.json();
    } catch (error) {
      console.error('Chatbot suggestions error:', error);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      const response = await fetch('/api/chatbot/health');
      if (!response.ok) {
        throw new Error('Chatbot service unavailable');
      }
      return await response.json();
    } catch (error) {
      console.error('Chatbot health check error:', error);
      throw error;
    }
  }
};
