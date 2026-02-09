import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clubReducer from './clubSlice';
import eventReducer from './eventSlice';
import invitationReducer from './invitationSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    club: clubReducer,
    event: eventReducer,
    invitation: invitationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;