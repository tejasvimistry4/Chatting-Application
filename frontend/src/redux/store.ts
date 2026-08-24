import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import chatsReducer from "./chats/chatSlice";
import messagesReducer from "./messages/messagesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
