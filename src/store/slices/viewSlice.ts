import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ViewType = "member" | "attorney" | null;

interface ViewState {
  view: ViewType;
}

const initialState: ViewState = {
  view: null,
};

const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setView(state, action: PayloadAction<ViewType>) {
      state.view = action.payload;
    },
    resetView(state) {
      state.view = null;
    },
  },
});

export const { setView, resetView } = viewSlice.actions;
export default viewSlice.reducer;