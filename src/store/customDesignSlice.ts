"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CustomDesignState {
  lastPath: string;
  category: string;
  selections: any;
  engagementModel: string | null;
  selectedAgent: any | null;
  isFlowActive: boolean;
}

const initialState: CustomDesignState = {
  lastPath: "/custom-design",
  category: "",
  selections: {},
  engagementModel: null,
  selectedAgent: null,
  isFlowActive: false,
};

const customDesignSlice = createSlice({
  name: "customDesign",
  initialState,
  reducers: {
    startFlow: (state, action: PayloadAction<{ category: string; lastPath: string }>) => {
      state.category = action.payload.category;
      state.lastPath = action.payload.lastPath;
      state.isFlowActive = true;
    },
    updateSelections: (state, action: PayloadAction<any>) => {
      state.selections = action.payload;
    },
    setEngagementModel: (state, action: PayloadAction<string>) => {
      state.engagementModel = action.payload;
      state.lastPath = "/custom-design/agent-list";
    },
    setSelectedAgent: (state, action: PayloadAction<any>) => {
      state.selectedAgent = action.payload;
      state.lastPath = "/custom-design/agent-details";
    },
    updateLastPath: (state, action: PayloadAction<string>) => {
      state.lastPath = action.payload;
    },
    resetFlow: (state) => {
      return initialState;
    },
  },
});

export const {
  startFlow,
  updateSelections,
  setEngagementModel,
  setSelectedAgent,
  updateLastPath,
  resetFlow,
} = customDesignSlice.actions;

export default customDesignSlice.reducer;
