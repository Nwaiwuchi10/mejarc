"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import customDesignReducer from "./customDesignSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    customDesign: customDesignReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
