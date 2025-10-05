import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  unit: string;
  brand: string;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  loading: boolean;
  error: string | null;
}

type CartAction =
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CART_DATA'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isOpen: false,
  loading: false,
  error: null,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART_DATA':
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        loading: false,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };
    
    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // API Base URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Helper function for API calls
  const makeApiCall = async (url: string, options: RequestInit = {}) => {
    try {
      console.log(`🚀 Making API call to: ${url}`);
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if you have a token
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ API call successful:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API call failed:`, error);
      throw error;
    }
  };

  // Helper to map cart items from backend response
  const mapCartItems = (items: any[]): CartItem[] => {
    return items.map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
      unit: item.product.unit,
      brand: item.product.brand,
    }));
  };

  // Load cart from backend
  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await makeApiCall(`${API_BASE_URL}/cart`);
      
      if (response.success && response.data) {
        const cartItems = mapCartItems(response.data.items);
        dispatch({ type: 'SET_CART_DATA', payload: cartItems });
        console.log(`📦 Cart loaded successfully: ${cartItems.length} items`);
      } else {
        dispatch({ type: 'SET_CART_DATA', payload: [] });
        console.log(`📦 No cart found, starting with empty cart`);
      }
    } catch (error) {
      console.error('❌ Failed to load cart:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Failed to load cart' });
    }
  };

  // Add item to cart (backend + sync state)
  const addItem = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      console.log(`🛒 Adding item to cart:`, item);
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await makeApiCall(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        body: JSON.stringify({
          productId: item._id,
          quantity: 1,
        }),
      });

      if (response.success) {
        const cartItems = mapCartItems(response.data.items);
        dispatch({ type: 'SET_CART_DATA', payload: cartItems });
        console.log(`✅ Item added to cart successfully:`, response);
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('❌ Failed to add item to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Failed to add item to cart' });
    }
  };

  // Remove item from cart
  const removeItem = async (id: string) => {
    try {
      console.log(`🗑️ Removing item from cart: ${id}`);
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await makeApiCall(`${API_BASE_URL}/cart/remove/${id}`, {
        method: 'DELETE',
      });

      if (response.success) {
        const cartItems = mapCartItems(response.data.items);
        dispatch({ type: 'SET_CART_DATA', payload: cartItems });
        console.log(`✅ Item removed from cart successfully`);
      } else {
        throw new Error(response.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('❌ Failed to remove item from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Failed to remove item from cart' });
    }
  };

  // Update item quantity
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      console.log(`📝 Updating quantity for item ${id}: ${quantity}`);
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      if (quantity < 1) {
        await removeItem(id);
        return;
      }

      const response = await makeApiCall(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        body: JSON.stringify({
          productId: id,
          quantity: quantity,
        }),
      });

      if (response.success) {
        const cartItems = mapCartItems(response.data.items);
        dispatch({ type: 'SET_CART_DATA', payload: cartItems });
        console.log(`✅ Quantity updated successfully`);
      } else {
        throw new Error(response.message || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('❌ Failed to update quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Failed to update quantity' });
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      console.log(`🧹 Clearing cart`);
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await makeApiCall(`${API_BASE_URL}/cart/clear`, {
        method: 'DELETE',
      });

      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
        console.log(`✅ Cart cleared successfully`);
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('❌ Failed to clear cart:', error);
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message || 'Failed to clear cart' });
    }
  };

  // Local UI actions (no API calls needed)
  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  // Load cart on component mount
  useEffect(() => {
    loadCart();
  }, []);

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};