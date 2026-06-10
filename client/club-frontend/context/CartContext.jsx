/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const localData = localStorage.getItem('gacela_cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('gacela_cart', JSON.stringify(cart));
  }, [cart]);

 const addToCart = (producto) => {
  setCart((prevCart) => {
    // Buscamos si ya existe el mismo artículo con el MISMO talle en el carrito
    const itemExiste = prevCart.find(
      (item) => item._id === producto._id && item.talleElegido === producto.talleElegido
    );

    if (itemExiste) {
      return prevCart.map((item) =>
        item._id === producto._id && item.talleElegido === producto.talleElegido
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    }

    // Si es nuevo, lo agregamos manteniendo intactas las variables del talle que le pasamos
    return [...prevCart, { ...producto, cantidad: 1 }];
  });
};

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}