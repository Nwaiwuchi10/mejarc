"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePics?: string;
}

interface AuthState {
  userToken?: string | null;
  agentToken?: string | null;
  userId?: string | null;
  agentId?: string | null;
  isAgent?: boolean;
  isAgentApproved?: boolean;
  user?: UserData | null;
}

const initialState: AuthState = {
  userToken: null,
  agentToken: null,
  userId: null,
  agentId: null,
  isAgent: false,
  isAgentApproved: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<Partial<AuthState>>) {
      const payload = action.payload;
      if (payload.userToken !== undefined) state.userToken = payload.userToken ?? null;
      if (payload.agentToken !== undefined) state.agentToken = payload.agentToken ?? null;
      if (payload.userId !== undefined) state.userId = payload.userId ?? null;
      if (payload.agentId !== undefined) state.agentId = payload.agentId ?? null;
      if (payload.isAgent !== undefined) state.isAgent = payload.isAgent;
      if (payload.isAgentApproved !== undefined) state.isAgentApproved = payload.isAgentApproved;
      if (payload.user !== undefined) state.user = payload.user ?? null;
    },
    logout(state) {
      state.userToken = null;
      state.agentToken = null;
      state.userId = null;
      state.agentId = null;
      state.isAgent = false;
      state.isAgentApproved = false;
      state.user = null;
    },
    setUser(state, action: PayloadAction<UserData | null>) {
      state.user = action.payload;
    },
  },
});

export const { setAuth, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
