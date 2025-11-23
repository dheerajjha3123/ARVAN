"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type CartItem = {
  productId: string,
  id: string;
  name: string;
  price: number;
  productVariantId?: string;
  quantity: number;
  color: string;
  size: string;
  image: string;
  stock?: number;
  material: string;
  asset : string;
};

type AddToCartItem = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type cartContext = {
  cart: CartItem[];
  addToCart: (item: AddToCartItem) => void;
  removeFromCart: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<cartContext | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  
  const addToCart = (item: AddToCartItem) => {
    // Ensure quantity is a number before proceeding
    const quantityToAdd: number =
      item.quantity !== undefined ? item.quantity : 1;
  
    const itemWithQuantity: CartItem = {
      ...(item as Omit<CartItem, "quantity">), // Cast to ensure all required fields are present
      quantity: quantityToAdd,
    };
  
    setCart((prevCart: CartItem[]) => {
      // Find existing item with same product ID, size, and color
      const existingItem = prevCart.find(
        (cartItem) => 
          cartItem.id === item.id && 
          cartItem.size === item.size && 
          cartItem.color === item.color
      );
  
      // If exact match (same product, size, and color) exists, update quantity
      if (existingItem) {
        return prevCart.map((cartItem) =>
          (cartItem.id === item.id && 
           cartItem.size === item.size && 
           cartItem.color === item.color)
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem
        );
      }
  
      // Otherwise add as a new item
      return [...prevCart, itemWithQuantity];
    });
  };

 // Update quantity of an item in the cart
const updateQuantity = (id: string, size: string, color: string, quantity: number) => {
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    removeFromCart(id, size, color);
    return;
  }

  setCart((prevCart) =>
    prevCart.map((cartItem) =>
      (cartItem.id === id && 
       cartItem.size === size && 
       cartItem.color === color)
        ? { ...cartItem, quantity } 
        : cartItem
    )
  );
};

// Remove an item from the cart based on id, size, and color
const removeFromCart = (id: string, size: string, color: string) => {
  setCart((prevCart) => 
    prevCart.filter((cartItem) => 
      !(cartItem.id === id && 
        cartItem.size === size && 
        cartItem.color === color)
    )
  );
};

// Clear the entire cart
const clearCart = () => {
  setCart([]);
};
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be within a Cart Provider.");

  return context;
};
