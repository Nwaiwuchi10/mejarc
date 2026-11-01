"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  area?: string;
  productImage: string[];
  quantity: number;
  fileType?: string;
  drawingSets?: string[];
  addOns?: string[];
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const getInitialState = (): CartState => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("mejarc_cart");
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }
  return {
    items: [],
    totalAmount: 0,
  };
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getInitialState(),
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (!existingItem) {
        state.items.push(newItem);
      } else {
        existingItem.quantity += newItem.quantity;
        // Optionally update selection if needed
        existingItem.area = newItem.area || existingItem.area;
        existingItem.fileType = newItem.fileType;
        existingItem.drawingSets = newItem.drawingSets;
        existingItem.addOns = newItem.addOns;
      }

      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("mejarc_cart", JSON.stringify(state));
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("mejarc_cart", JSON.stringify(state));
      }
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("mejarc_cart", JSON.stringify(state));
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      if (typeof window !== "undefined") {
        localStorage.removeItem("mejarc_cart");
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
