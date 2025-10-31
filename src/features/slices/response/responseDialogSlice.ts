import { createSlice } from '@reduxjs/toolkit';

export interface ResponseDialogState {
  open: boolean;
  message: string;
}

const initialState: ResponseDialogState = {
  open: false,
  message: '',
};

export const responseDialogSlice = createSlice({
  name: 'responseDialog',
  initialState,
  reducers: {
    openResponseDialog: (state, action) => {
      state.open = true;
      state.message = action.payload;
    },
    closeResponseDialog: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { openResponseDialog, closeResponseDialog } = responseDialogSlice.actions;
